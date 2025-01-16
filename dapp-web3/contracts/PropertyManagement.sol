// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./utils/PropertyLibrary.sol";
import "./utils/ReentrancyGuard.sol";
import "./AdminManagement.sol";

contract PropertyManagement is ReentrancyGuard {
    using PropertyLibrary for PropertyLibrary.PropertyStorage;
    PropertyLibrary.PropertyStorage private s;
    AdminManagement private adminManagement;
    EventHub private eventHub;
    bool private initialized;

    // Reserve space for future state variables
    uint256[50] private __gap;

    modifier initializer() {
        require(!initialized, "Already initialized");
        _;
        initialized = true;
    }

    function initialize(
        address _adminManagement,
        address _eventHub
    ) public payable initializer {
        adminManagement = AdminManagement(_adminManagement);
        eventHub = EventHub(_eventHub);
    }

    function createApartment(
        string memory name,
        string memory description,
        string memory location,
        string[] memory imageHashes,
        uint rooms,
        uint price,
        uint taxPercent,
        uint securityFee
    ) public nonReentrant returns (uint) {
        require(
            imageHashes.length <= adminManagement.getAdminSettings().maxImages,
            "Exceeds maximum number of images allowed"
        );
        require(taxPercent <= 100, "Tax percent cannot exceed 100");

        uint id = s.createApartment(
            name,
            description,
            location,
            imageHashes,
            rooms,
            price,
            taxPercent,
            securityFee,
            msg.sender
        );
        eventHub.emitApartmentCreated(id, msg.sender);
        return id;
    }

    function updateApartment(
        uint id,
        string memory name,
        string memory description,
        string memory location,
        string[] memory newImageHashes,
        uint rooms,
        uint price,
        uint taxPercent,
        uint securityFee
    ) public nonReentrant {
        require(s.apartmentExist[id], "Apartment not found");
        require(
            msg.sender == s.apartments[id].owner,
            "Unauthorized personnel, owner only"
        );
        require(taxPercent <= 100, "Tax percent cannot exceed 100");

        // Calculate total images (existing + new)
        uint currentImageCount = s.apartments[id].imageHashes.length;
        uint newImageCount = newImageHashes.length;
        require(
            currentImageCount + newImageCount <=
                adminManagement.getAdminSettings().maxImages,
            "Exceeds maximum number of images allowed"
        );

        s.updateApartment(
            id,
            name,
            description,
            location,
            newImageHashes,
            rooms,
            price,
            taxPercent,
            securityFee
        );
        eventHub.emitApartmentUpdated(id);
    }

    function getApartments(
        uint startIndex,
        uint count
    ) public view returns (PropertyLibrary.ApartmentStruct[] memory) {
        return s.getApartments(startIndex, count);
    }

    function deleteApartment(uint id) public nonReentrant {
        require(s.apartmentExist[id], "Apartment not found");
        require(s.apartments[id].owner == msg.sender, "Unauthorized entity");
        s.deleteApartment(id);
        eventHub.emitApartmentDeleted(id);
    }

    function bookApartment(
        uint aid,
        uint[] memory dates
    ) public payable nonReentrant returns (uint) {
        require(s.apartmentExist[aid], "Apartment not found!");
        uint totalPrice = s.apartments[aid].price * dates.length;
        uint totalCost = totalPrice +
            ((totalPrice * s.apartments[aid].securityFee) / 100);
        require(msg.value >= totalCost, "Insufficient funds!");
        require(
            s.datesAreCleared(aid, dates),
            "Booked date found among dates!"
        );

        uint bookingId = s.bookApartment(
            aid,
            dates,
            msg.sender,
            s.apartments[aid].price
        );
        eventHub.emitBookingCreated(bookingId, aid, msg.sender);
        return bookingId;
    }

    function checkInApartment(uint aid, uint bookingId) public nonReentrant {
        PropertyLibrary.BookingStruct memory booking = s.bookingsOf[aid][
            bookingId
        ];
        require(msg.sender == booking.tenant, "Unauthorized tenant!");
        require(!booking.checked, "Apartment already checked on this date!");

        s.bookingsOf[aid][bookingId].checked = true;

        uint tax = (booking.price * s.apartments[aid].taxPercent) / 100;
        uint fee = (booking.price * s.apartments[aid].securityFee) / 100;

        s.hasBooked[msg.sender][aid] = true;

        payTo(s.apartments[aid].owner, booking.price - tax);
        payTo(adminManagement.owner(), tax);
        payTo(msg.sender, fee);

        eventHub.emitBookingCheckedIn(bookingId, aid, msg.sender);
    }

    function claimFunds(uint aid, uint bookingId) public nonReentrant {
        require(msg.sender == s.apartments[aid].owner, "Unauthorized entity");
        require(
            !s.bookingsOf[aid][bookingId].checked,
            "Funds already claimed for this booking!"
        );

        uint price = s.bookingsOf[aid][bookingId].price;
        uint fee = (price * s.apartments[aid].taxPercent) / 100;
        uint securityDeposit = (price * s.apartments[aid].securityFee) / 100;

        s.bookingsOf[aid][bookingId].checked = true;

        payTo(s.apartments[aid].owner, price - fee);
        payTo(adminManagement.owner(), fee);
        payTo(s.bookingsOf[aid][bookingId].tenant, securityDeposit);

        eventHub.emitFundsClaimed(aid, bookingId, msg.sender);
    }

    function refundBooking(uint aid, uint bookingId) public nonReentrant {
        PropertyLibrary.BookingStruct memory booking = s.bookingsOf[aid][
            bookingId
        ];
        require(!booking.checked, "Apartment already checked on this date!");
        require(
            s.isDateBooked[aid][booking.date],
            "Did not book on this date!"
        );

        if (msg.sender != adminManagement.owner()) {
            require(msg.sender == booking.tenant, "Unauthorized tenant!");
            require(
                booking.date > block.timestamp,
                "Can no longer refund, booking date started"
            );
        }

        s.bookingsOf[aid][bookingId].cancelled = true;
        s.isDateBooked[aid][booking.date] = false;

        uint lastIndex = s.bookedDates[aid].length - 1;
        uint lastBookingDate = s.bookedDates[aid][lastIndex];
        s.bookedDates[aid][bookingId] = lastBookingDate;
        s.bookedDates[aid].pop();

        uint fee = (booking.price * s.apartments[aid].securityFee) / 100;
        uint collateral = fee / 2;

        payTo(s.apartments[aid].owner, collateral);
        payTo(adminManagement.owner(), collateral);
        payTo(booking.tenant, booking.price - fee);

        eventHub.emitBookingRefunded(aid, bookingId, msg.sender);
    }

    function getUnavailableDates(uint aid) public view returns (uint[] memory) {
        return s.bookedDates[aid];
    }

    function getBookings(
        uint aid,
        uint startIndex,
        uint count
    ) public view returns (PropertyLibrary.BookingStruct[] memory) {
        return s.getBookings(aid, startIndex, count);
    }

    function getBooking(
        uint aid,
        uint bookingId
    ) public view returns (PropertyLibrary.BookingStruct memory) {
        return s.bookingsOf[aid][bookingId];
    }

    function getQualifiedReviewers(
        uint aid
    ) public view returns (address[] memory) {
        return s.getQualifiedReviewers(aid);
    }

    function tenantBooked(uint apartmentId) public view returns (bool) {
        return s.hasBooked[msg.sender][apartmentId];
    }

    function payTo(address to, uint256 amount) internal {
        (bool success, ) = payable(to).call{value: amount}("");
        require(success);
    }
}

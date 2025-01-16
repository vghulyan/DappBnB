// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./PropertyManagement.sol";
import "./ReviewManagement.sol";
import "./EventHub.sol";

contract DappBnB {
    PropertyManagement public propertyManagement;
    ReviewManagement public reviewManagement;
    EventHub public eventHub;
    AdminManagement private adminManagement;
    bool private initialized;

    // Reserve space for future state variables
    uint256[50] private __gap;

    modifier initializer() {
        require(!initialized, "Already initialized");
        _;
        initialized = true;
    }

    function initialize(
        address _propertyManagement,
        address _reviewManagement,
        address _eventHub,
        address _adminManagement
    ) public payable initializer {
        propertyManagement = PropertyManagement(_propertyManagement);
        reviewManagement = ReviewManagement(_reviewManagement);
        eventHub = EventHub(_eventHub);
        adminManagement = AdminManagement(_adminManagement);
    }

    modifier onlyOwner() {
        require(
            msg.sender == adminManagement.owner(),
            "Caller is not the owner"
        );
        _;
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
    ) public {
        uint id = propertyManagement.createApartment(
            name,
            description,
            location,
            imageHashes,
            rooms,
            price,
            taxPercent,
            securityFee
        );
        eventHub.emitApartmentCreated(id, msg.sender);
    }

    function updateApartment(
        uint id,
        string memory name,
        string memory description,
        string memory location,
        string[] memory imageHashes,
        uint rooms,
        uint price,
        uint taxPercent,
        uint securityFee
    ) public {
        propertyManagement.updateApartment(
            id,
            name,
            description,
            location,
            imageHashes,
            rooms,
            price,
            taxPercent,
            securityFee
        );
        eventHub.emitApartmentUpdated(id);
    }

    function deleteApartment(uint id) public {
        propertyManagement.deleteApartment(id);
        eventHub.emitApartmentDeleted(id);
    }

    function getApartments(
        uint startIndex,
        uint count
    ) public view returns (PropertyLibrary.ApartmentStruct[] memory) {
        // Retrieve the maximum page size from admin settings
        uint pageSize = adminManagement.getAdminSettings().pageSize;

        // Determine the number of apartments to retrieve based on user input and pageSize limit
        uint finalCount = count <= pageSize ? count : pageSize;

        // Get apartments with the adjusted count
        return propertyManagement.getApartments(startIndex, finalCount);
    }

    function bookApartment(uint aid, uint[] memory dates) public payable {
        uint bookingId = propertyManagement.bookApartment{value: msg.value}(
            aid,
            dates
        );
        eventHub.emitBookingCreated(bookingId, aid, msg.sender);
    }

    function checkInApartment(uint aid, uint bookingId) public {
        propertyManagement.checkInApartment(aid, bookingId);
        eventHub.emitBookingCheckedIn(bookingId, aid, msg.sender);
    }

    function claimFunds(uint aid, uint bookingId) public {
        propertyManagement.claimFunds(aid, bookingId);
        eventHub.emitFundsClaimed(aid, bookingId, msg.sender);
    }

    function refundBooking(uint aid, uint bookingId) public {
        propertyManagement.refundBooking(aid, bookingId);
        eventHub.emitBookingRefunded(aid, bookingId, msg.sender);
    }

    function getUnavailableDates(uint aid) public view returns (uint[] memory) {
        return propertyManagement.getUnavailableDates(aid);
    }

    function getBookings(
        uint aid,
        uint startIndex,
        uint count
    ) public view returns (PropertyLibrary.BookingStruct[] memory) {
        return propertyManagement.getBookings(aid, startIndex, count);
    }

    function getQualifiedReviewers(
        uint aid
    ) public view returns (address[] memory) {
        return propertyManagement.getQualifiedReviewers(aid);
    }

    function getBooking(
        uint aid,
        uint bookingId
    ) public view returns (PropertyLibrary.BookingStruct memory) {
        return propertyManagement.getBooking(aid, bookingId);
    }

    function addReview(uint aid, string memory reviewText) public {
        reviewManagement.addReview(aid, reviewText);
        uint id = reviewManagement.getReviews(aid).length - 1;
        eventHub.emitReviewAdded(id, aid, msg.sender);
    }

    function getReviews(
        uint aid
    ) public view returns (PropertyLibrary.ReviewStruct[] memory) {
        return reviewManagement.getReviews(aid);
    }

    function tenantBooked(uint apartmentId) public view returns (bool) {
        return propertyManagement.tenantBooked(apartmentId);
    }

    // --------------------------- ADMI ---------------------------
    function transferOwnership(address payable newOwner) public onlyOwner {
        adminManagement.transferOwnership(newOwner);
    }

    function setAdminSettings(
        uint256 _pageSize,
        uint256 _maxImages
    ) public onlyOwner {
        adminManagement.setAdminSettings(_pageSize, _maxImages);
    }

    function updatePageSize(uint256 _pageSize) public onlyOwner {
        adminManagement.updatePageSize(_pageSize);
    }

    function updateMaxImages(uint256 _maxImages) public onlyOwner {
        adminManagement.updateMaxImages(_maxImages);
    }

    function getAdminSettings()
        public
        view
        returns (AdminManagement.AdminSettings memory)
    {
        return adminManagement.getAdminSettings();
    }

    function isAdmin(address _user) public view returns (bool) {
        return _user == adminManagement.owner();
    }
}

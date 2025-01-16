// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract EventHub {
    bool private initialized;

    // Reserve space for future state variables
    uint256[50] private __gap;

    modifier initializer() {
        require(!initialized, "Already initialized");
        _;
        initialized = true;
    }

    function initialize() public initializer {}

    // Define events
    event ApartmentCreated(uint256 id, address owner);
    event ApartmentUpdated(uint256 id);
    event ApartmentDeleted(uint256 id);
    event BookingCreated(
        uint256 bookingId,
        uint256 apartmentId,
        address tenant
    );
    event BookingCheckedIn(
        uint256 bookingId,
        uint256 apartmentId,
        address tenant
    );
    event FundsClaimed(uint256 apartmentId, uint256 bookingId, address owner);
    event BookingRefunded(
        uint256 apartmentId,
        uint256 bookingId,
        address tenant
    );
    event ReviewAdded(uint256 id, uint256 aid, address owner);
    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );

    // Emit functions
    function emitApartmentCreated(uint256 id, address owner) external {
        emit ApartmentCreated(id, owner);
    }

    function emitApartmentUpdated(uint256 id) external {
        emit ApartmentUpdated(id);
    }

    function emitApartmentDeleted(uint256 id) external {
        emit ApartmentDeleted(id);
    }

    function emitBookingCreated(
        uint256 bookingId,
        uint256 apartmentId,
        address tenant
    ) external {
        emit BookingCreated(bookingId, apartmentId, tenant);
    }

    function emitBookingCheckedIn(
        uint256 bookingId,
        uint256 apartmentId,
        address tenant
    ) external {
        emit BookingCheckedIn(bookingId, apartmentId, tenant);
    }

    function emitFundsClaimed(
        uint256 apartmentId,
        uint256 bookingId,
        address owner
    ) external {
        emit FundsClaimed(apartmentId, bookingId, owner);
    }

    function emitBookingRefunded(
        uint256 apartmentId,
        uint256 bookingId,
        address tenant
    ) external {
        emit BookingRefunded(apartmentId, bookingId, tenant);
    }

    function emitReviewAdded(uint256 id, uint256 aid, address owner) external {
        emit ReviewAdded(id, aid, owner);
    }

    function emitOwnershipTransferred(
        address previousOwner,
        address newOwner
    ) external {
        emit OwnershipTransferred(previousOwner, newOwner);
    }
}

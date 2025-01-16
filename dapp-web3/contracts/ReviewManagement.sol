// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./utils/PropertyLibrary.sol";
import "./EventHub.sol";

contract ReviewManagement {
    using PropertyLibrary for PropertyLibrary.PropertyStorage;
    PropertyLibrary.PropertyStorage private s;
    bool private initialized;

    EventHub public eventHub;

    // Reserve space for future state variables
    uint256[50] private __gap;

    modifier initializer() {
        require(!initialized, "Already initialized");
        _;
        initialized = true;
    }

    function initialize(address _eventHub) public payable initializer {
        eventHub = EventHub(_eventHub);
    }

    function addReview(uint aid, string memory reviewText) public {
        require(s.apartmentExist[aid], "Apartment not available");
        require(s.hasBooked[msg.sender][aid], "Book first before review");
        require(bytes(reviewText).length > 0, "Review text cannot be empty");

        uint id = s.reviewsOf[aid].length;
        PropertyLibrary.ReviewStruct memory review = PropertyLibrary
            .ReviewStruct({
                id: id,
                aid: aid,
                reviewText: reviewText,
                timestamp: PropertyLibrary.currentTime(),
                owner: msg.sender
            });

        s.reviewsOf[aid].push(review);
        eventHub.emitReviewAdded(id, aid, msg.sender); // Emit event through EventHub
    }

    function getReviews(
        uint aid
    ) public view returns (PropertyLibrary.ReviewStruct[] memory) {
        return s.reviewsOf[aid];
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./EventHub.sol";

contract AdminManagement {
    address payable private _owner;
    bool private initialized;

    EventHub public eventHub;

    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );

    struct AdminSettings {
        uint256 pageSize;
        uint256 maxImages;
    }

    AdminSettings public adminSettings;

    // Reserve space for future state variables
    uint256[50] private __gap;

    modifier initializer() virtual {
        require(!initialized, "Already initialized");
        _;
        initialized = true;
    }

    function initialize(
        address _eventHub,
        AdminSettings memory initialSettings
    ) public payable virtual initializer {
        _owner = payable(msg.sender);
        eventHub = EventHub(_eventHub);
        adminSettings = initialSettings;
        eventHub.emitOwnershipTransferred(address(0), _owner);
    }

    modifier onlyOwner() {
        require(msg.sender == _owner, "Caller is not the owner");
        _;
    }

    function owner() public view returns (address payable) {
        return _owner;
    }

    function transferOwnership(address payable newOwner) public onlyOwner {
        require(newOwner != address(0), "New owner is the zero address");
        eventHub.emitOwnershipTransferred(_owner, newOwner);
        _owner = newOwner;
    }

    function setAdminSettings(
        uint256 _pageSize,
        uint256 _maxImages
    ) public onlyOwner {
        adminSettings.pageSize = _pageSize;
        adminSettings.maxImages = _maxImages;
    }

    function updatePageSize(uint256 _pageSize) public onlyOwner {
        adminSettings.pageSize = _pageSize;
    }

    function updateMaxImages(uint256 _maxImages) public onlyOwner {
        adminSettings.maxImages = _maxImages;
    }

    function getAdminSettings() public view returns (AdminSettings memory) {
        return adminSettings;
    }

    function resetAdminSettings() public onlyOwner {
        adminSettings.pageSize = 0;
        adminSettings.maxImages = 0;
    }
}

//SPDX-License-Identifier: Unlicense
pragma solidity ^0.7.0;

import "hardhat/console.sol";

contract AuthProvider {
    mapping(address => uint256) internal _auth;

    mapping(address => address[]) internal _subs;
    mapping(address => address) internal _subOwner;
    mapping(address => bool) internal _subActive;

    uint256 internal _ttl = 5 minutes;

    address[] internal _controllers;
    mapping(address => bool) internal _isController;

    event Auth(address authenticated, uint256 timestamp, address controller);
    event AuthSub(address subAddress, address parentAddress);
    event AuthSubRemoved(address subAddress, address parentAddress);

    constructor(address[] memory operators) {
        _setControllers(operators);
    }

    function lastAuth(address addr) external view returns (uint256) {
        return _auth[addr];
    }

    function authenticateSub(address addr) external {
        require(
            _auth[msg.sender] > 0,
            "msg.sender has not been authenticated before"
        );
        require(
            _auth[msg.sender] == 0,
            "address is allready claimed by another address"
        );
        require(
            !_subActive[addr],
            "address is allready claimed as sub by another address"
        );
        _subOwner[addr] = msg.sender;
        _subActive[addr] = true;
        _subs[msg.sender].push(addr);
        emit AuthSub(msg.sender, addr);
    }

    function deAuthenticateSub(address addr) external {
        require(
            _auth[msg.sender] > 0,
            "msg.sender is has not been authenticated before"
        );
        require(
            _subOwner[addr] == msg.sender,
            "msg.sender is not owner of requested address"
        );
        _subActive[addr] = false;
        emit AuthSubRemoved(msg.sender, addr);
    }

    function authenticate(address addr) external {
        require(_isController[msg.sender], "msg.sender is not controller");
        _auth[addr] = block.timestamp;
        emit Auth(addr, block.timestamp, msg.sender);
    }

    function hasAuthenticated(address addr, uint256 latestAcceptedTimestamp)
        public
        view
        returns (bool)
    {
        uint256 authTimestamp = _auth[addr];
        if (
            authTimestamp != uint256(0) &&
            authTimestamp >= latestAcceptedTimestamp
        ) {
            return true;
        } else if (_subActive[addr]) {
            // Check if this is an active sub address
            uint256 ownerTimestamp = _auth[_subOwner[addr]];
            if (
                ownerTimestamp != uint256(0) &&
                ownerTimestamp >= latestAcceptedTimestamp
            ) {
                return true;
            }
        }
        return false;
    }

    function isAuthenticated(address addr) external view returns (bool) {
        return hasAuthenticated(addr, block.timestamp - _ttl);
    }

    function subs(address addr)
        external
        view
        returns (address[] memory subAddresses)
    {
        return _subs[addr];
    }

    function isSub(address addr) external view returns (bool) {
        if (_auth[msg.sender] != 0) {
            return false;
        }
        if (_subOwner[addr] != address(0)) {
            return true;
        }
        return false;
    }

    function subActive(address addr) external view returns (bool) {
        if (_auth[msg.sender] != 0) {
            return false;
        }
        return _subActive[addr];
    }

    function setTTL(uint256 time) external {
        require(_isController[msg.sender], "msg.sender is not controller");
        _ttl = time;
    }

    function controllers() external view returns (address[] memory) {
        return _controllers;
    }

    function setControllers(address[] calldata operators) external {
        require(_isController[msg.sender], "msg.sender is not controller");
        _setControllers(operators);
    }

    function _setControllers(address[] memory operators) internal {
        for (uint256 i = 0; i < _controllers.length; i++) {
            _isController[_controllers[i]] = false;
        }
        for (uint256 j = 0; j < operators.length; j++) {
            _isController[operators[j]] = true;
        }
        _controllers = operators;
    }
}

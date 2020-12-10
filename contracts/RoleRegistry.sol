//SPDX-License-Identifier: Unlicense
pragma solidity ^0.7.0;

import "hardhat/console.sol";

contract RoleRegistry {
    mapping(address => mapping(bytes32 => mapping(address => bool)))
        internal roles;

    mapping(address => address) internal managers;

    event RoleSet(
        address indexed addr,
        bytes32 indexed _role,
        address indexed roleHolder
    );

    event RoleRemoved(
        address indexed addr,
        bytes32 indexed _role,
        address indexed roleHolder
    );

    event ManagerChanged(address indexed addr, address indexed newManager);

    function setRole(
        address _addr,
        bytes32 _role,
        address _roleHolder
    ) external {
        address addr = _addr == address(0) ? msg.sender : _addr;
        require(getManager(addr) == msg.sender, "Not the manager");
        require(_role != bytes32(0));
        roles[_addr][_role][_roleHolder] = true;
        emit RoleSet(addr, _role, _roleHolder);
    }

    function removeRole(
        address _addr,
        bytes32 _role,
        address _roleHolder
    ) external {
        address addr = _addr == address(0) ? msg.sender : _addr;
        require(getManager(addr) == msg.sender, "Not the manager");
        require(_role != bytes32(0));
        roles[_addr][_role][_roleHolder] = false;
        emit RoleRemoved(addr, _role, _roleHolder);
    }

    function hasRole(
        address _roleProvider,
        bytes32 _role,
        address _roleHolder
    ) public view returns (bool) {
        address roleProvider = _roleProvider == address(0)
            ? msg.sender
            : _roleProvider;
        return roles[roleProvider][_role][_roleHolder];
    }

    function getManager(address _addr) public view returns (address) {
        // By default the manager of an address is the same address
        if (managers[_addr] == address(0)) {
            return _addr;
        } else {
            return managers[_addr];
        }
    }

    function setManager(address _addr, address _newManager) external {
        require(getManager(_addr) == msg.sender, "Not the manager");
        managers[_addr] = _newManager == _addr ? address(0) : _newManager;
        emit ManagerChanged(_addr, _newManager);
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract KYCRegistry {
    struct KYCRecord {
        string kycIdName;
        bytes32 kycHash;
        uint256 timestamp;
    }

    mapping(address => KYCRecord[]) public records;

    event KYCStored(address indexed user, string kycIdName, bytes32 kycHash, uint256 timestamp);

    function storeKYC(string memory kycIdName, bytes32 kycHash, uint256 timestamp) public {
        records[msg.sender].push(
            KYCRecord(kycIdName, kycHash, timestamp)
        );
        emit KYCStored(msg.sender, kycIdName, kycHash, timestamp);
    }

    function getLastKYC(address user) public view returns (string memory, bytes32, uint256) {
        require(records[user].length > 0, "No records found");
        uint256 lastIdx = records[user].length - 1;
        KYCRecord memory rec = records[user][lastIdx];
        return (rec.kycIdName, rec.kycHash, rec.timestamp);
    }
}

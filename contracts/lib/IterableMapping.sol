// Based IterableMapping from the official v0.5.14 solidity docs
pragma solidity >=0.4.0 <0.7.0;

library IterableMapping {

    // Copying KeyFlag[] from memory to storage not yet implemented, separate them into value type arrays
    struct itmap {
        mapping(bytes32 => IndexValue) data;
        bytes32[] keys;
        // KeyFlag[] keys;
        uint8 size;
    }

    struct IndexValue { uint keyIndex; bool value; }
    // struct KeyFlag { bytes32 key; bool deleted; }

    function insert(itmap storage self, bytes32 key) internal returns (bool replaced) {
        uint keyIndex = self.data[key].keyIndex;
        self.data[key].value = true;
        if (keyIndex > 0)
            return true;
        else {
            keyIndex = self.keys.length++;
            self.data[key].keyIndex = keyIndex + 1;
            self.keys[keyIndex] = key;
            self.size++;
            return false;
        }
    }

    function remove(itmap storage self, bytes32 key) internal returns (bool success) {
        uint keyIndex = self.data[key].keyIndex;
        if (keyIndex == 0)
            return false;
        delete self.data[key];
        self.size --;
    }

    function contains(itmap storage self, bytes32 key) internal view returns (bool) {
        return self.data[key].keyIndex > 0;
    }

    function valid(itmap storage self, uint keyIndex) internal view returns (bool) {
        return keyIndex < self.keys.length;
    }

    function get(itmap storage self, uint keyIndex) internal view returns (bytes32 key, bool value) {
        key = self.keys[keyIndex];
        value = self.data[key].value;
    }
}
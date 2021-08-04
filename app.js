const SHA256 = require("crypto-js/sha256");
const distance = require('google-distance-matrix');

class Block {
  constructor(index, timestamp, data, previousHash = " ") {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.computeHash();
    this.nonce = 0;
  }

  computeHash() {
    return SHA256(
        this.index +
        this.previousHash +
        this.timestamp +
        JSON.stringify(this.data) +
        this.nonce
    ).toString();
  }

  proofOfWork(difficulty) {
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
    ) {
      this.nonce++;
      this.hash = this.computeHash();
    }
  }
}

class Blockchain {
  constructor() {
    this.lightideasblockchain = [this.startGenesisBlock()];
    this.difficulty = 4;
  }
  startGenesisBlock() {
    return new Block(0, "01/01/2021", "Initial Block in the Chain", "0");
  }

  obtainLatestBlock() {
    return this.lightideasblockchain[this.lightideasblockchain.length - 1];
  }
  addNewBlock(newBlock) {
    newBlock.previousHash = this.obtainLatestBlock().hash;
    //newBlock.hash = newBlock.computeHash();
    newBlock.proofOfWork(this.difficulty);
    this.lightideasblockchain.push(newBlock);
  }

  checkChainValidity() {
    for (let i = 1; i < this.lightideasblockchain.length; i++) {
      const currentBlock = this.lightideasblockchain[i];
      const precedingBlock = this.lightideasblockchain[i - 1];

      if (currentBlock.hash !== currentBlock.computeHash()) {
        return false;
      }
      if (currentBlock.previousHash !== precedingBlock.hash) return false;
    }
    return true;
  }
}

let lightCoin = new Blockchain();

console.log("lightCoin mining in progress....");
lightCoin.addNewBlock(
  new Block(1, "01/06/2021", {
    sender: "sender 1",
    recipient: "recipient 1",
    quantity: 50,
  })
);

lightCoin.addNewBlock(
  new Block(2, "01/07/2021", {
    sender: "sender 2",
    recipient: "recipient 2",
    quantity: 100,
  })
);

console.log(JSON.stringify(lightCoin, null, 4));


// var origins = ['San Francisco CA', '40.7421,-73.9914'];
// var destinations = ['New York NY', 'Montreal', '41.8337329,-87.7321554', 'Honolulu'];

// distance.key('AIzaSyDIz9I2aJwrVpoP8V3VNW9VrflF-3WeupE');
// // distance.units('metric');    metric is default and standard (KM) // imperial for miles 

// distance.matrix(origins, destinations, function (err, distances) {
//     if (err) {
//         return console.log(err);
//     }
//     if(!distances) {
//         return console.log('no distances');
//     }
//     if (distances.status == 'OK') {
//         for (var i=0; i < origins.length; i++) {
//             for (var j = 0; j < destinations.length; j++) {
//                 var origin = distances.origin_addresses[i];
//                 var destination = distances.destination_addresses[j];
//                 if (distances.rows[0].elements[j].status == 'OK') {
//                     var distance = distances.rows[i].elements[j].distance.text;
//                     console.log('Distance from ' + origin + ' to ' + destination + ' is ' + distance);
//                 } else {
//                     console.log(destination + ' is not reachable by land from ' + origin);
//                 }
//             }
//         }
//     }
// });

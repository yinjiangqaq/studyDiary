function getMessageEncoding() {
  const rawText = "Hello RSA or ECC";
  let enc = new TextEncoder();
  return enc.encode(rawText);
}
async function RSAEncryption() {
  const keyPairs = await window.crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      // Consider using a 4096-bit key for systems that require long-term security
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"]
  );
  const startTime = performance.now();
  const publicKey = keyPairs.publicKey;
  let encoded = getMessageEncoding();
  const encryptedText = await window.crypto.subtle.encrypt(
    {
      name: "RSA-OAEP",
    },
    publicKey,
    encoded
  );
  const endTime = performance.now();
  return endTime - startTime;
}

// function getPerformanceData(taskTimes) {
//   let rsaTotalCount = 0;
//   let rsaTotalTimeCost = 0;

//   function performRSATimeCost(taskTimes) {
//     const startTime = performance.now();
//     RSAEncryption().then(() => {
//       // console.log("xxxxx startTime", startTime)
//       const endTime = performance.now();
//       // console.log("xxxxxx endTime", endTime)
//       const taskTime = endTime - startTime
//       rsaTotalTimeCost += taskTime;
//       rsaTotalCount += 1;
//       // console.log("xxxxxxx rasTotalTimeCost", rsaTotalTimeCost)
//       if (rsaTotalCount < taskTimes) {
//         performRSATimeCost(taskTimes);
//       } else {
//         console.log("RSA Average Time Cost", rsaTotalTimeCost / taskTimes);
//       }
//     });
//   }

//   performRSATimeCost(taskTimes);
// }

// getPerformanceData(10);

async function getAverageTime() {
  let total = 0;
  for (let i = 0; i < 1000; i++) {
    const rest = await RSAEncryption();
    total += rest;
  }
  console.log("RSA Average Time Cost in 1000 times", total / 1000);
}
getAverageTime();
// RSAEncryption();

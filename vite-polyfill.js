import crypto from 'node:crypto';

if (!crypto.hash) {
  crypto.hash = function (algorithm, data, outputEncoding) {
    const hash = crypto.createHash(algorithm);
    hash.update(data);
    return outputEncoding ? hash.digest(outputEncoding) : hash.digest();
  };
}

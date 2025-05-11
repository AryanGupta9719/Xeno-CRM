// In-memory queue for delivery receipts
const deliveryQueue = [];

export function enqueueReceipt(receipt) {
  deliveryQueue.push(receipt);
}

export function dequeueAllReceipts() {
  const receipts = [...deliveryQueue];
  deliveryQueue.length = 0;
  return receipts;
}

export function getQueueSize() {
  return deliveryQueue.length;
} 
import { PaymentModel } from '../payment.model';
import { PaymentStatus } from '../payment.constant';
import { AppError } from '@app/classes/AppError';

/**
 * Soft deletes a payment by setting its status to Deleted.
 * @param paymentId - The ID of the payment to delete.
 */
export const softDeletePayment = async (paymentId: string) => {
  const payment = await PaymentModel.findById(paymentId);

  if (!payment) {
    throw new AppError('Payment not found', 404);
  }

  if (payment.status === PaymentStatus.Deleted) {
    throw new AppError('Payment is already deleted', 400);
  }

  payment.status = PaymentStatus.Deleted;
  await payment.save();

  return payment;
};

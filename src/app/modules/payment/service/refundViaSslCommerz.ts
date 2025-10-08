import SSLCommerzPayment from "sslcommerz-lts";
import { config } from "@config/env";
import { IRefundOptions } from "../payment.type";

const store_id = config.sslStoreId;
const store_passwd = config.sslStorePass;
const is_live = false;

export const refundViaSslCommerz = async ({
  refundAmount,
  refundReason,
  bankTranId,
  refundTransId, 
  refeId,
}: IRefundOptions) => {
  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
  const result = await sslcz.initiateRefund({
    bank_tran_id: bankTranId,
    refund_trans_id: refundTransId,
    refund_amount: refundAmount,
    refund_remarks: refundReason,
    refe_id: refeId,
    format: "json",
  });

  return result as {
    APIConnect: string;
    bank_tran_id: string;
    trans_id?: string;
    refund_ref_id?: string;
    status?: string;
    errorReason?: string;
  };
};

export interface EmpikOrder {
  acceptance_decision_date: string;
  can_cancel: boolean;
  can_shop_ship: boolean;
  channel: string | null;
  commercial_id: string;
  created_date: string;
  currency_iso_code: string;
  customer: {
    billing_address: {
      city: string;
      company: string | null;
      company_2: string | null;
      country: string;
      country_iso_code: string | null;
      firstname?: string;
      lastname: string;
      phone: string;
      state: string | null;
      street_1: string;
      street_2: string | null;
      zip_code: string;
    };
    civility: string | null;
    customer_id: string;
    firstname: string;
    lastname: string;
    locale: string | null;
    shipping_address: {
      additional_info: string | null;
      city: string;
      company: string | null;
      company_2: string | null;
      country: string;
      country_iso_code: string | null;
      firstname?: string;
      lastname: string;
      phone: string;
      state: string | null;
      street_1: string;
      street_2: string | null;
      zip_code: string;
    };
  };
  customer_debited_date: string;
  customer_directly_pays_seller: boolean;
  customer_notification_email: string;
  delivery_date: string | null;
  fulfillment: {
    center: {
      code: string;
    };
  };
  fully_refunded: boolean;
  has_customer_message: boolean;
  has_incident: boolean;
  has_invoice: boolean;
  last_updated_date: string;
  leadtime_to_ship: number;
  order_additional_fields: Array<{
    code: string;
    type: string;
    value: string;
  }>;
  order_id: string;
  order_lines: Array<{
    can_refund: boolean;
    cancelations: any[];
    category_code: string;
    category_label: string;
    commission_fee: number;
    commission_rate_vat: number;
    commission_taxes: Array<{
      amount: number;
      code: string;
      rate: number;
    }>;
    commission_vat: number;
    created_date: string;
    debited_date: string;
    description: string | null;
    fees: any[];
    last_updated_date: string;
    offer_id: number;
    offer_sku: string;
    offer_state_code: string;
    order_line_additional_fields: any[];
    order_line_id: string;
    order_line_index: number;
    order_line_state: string;
    order_line_state_reason_code: string | null;
    order_line_state_reason_label: string | null;
    price: number;
    price_additional_info: string | null;
    price_unit: number;
    product_medias: Array<{
      media_url: string;
      mime_type: string;
      type: string;
    }>;
    product_shop_sku: string;
    product_sku: string;
    product_title: string;
    promotions: any[];
    quantity: number;
    received_date: string;
    refunds: Array<{
      amount: number;
      commission_amount: number;
      commission_tax_amount: number;
      commission_taxes: Array<{
        amount: number;
        code: string;
      }>;
      commission_total_amount: number;
      created_date: string;
      fees: any[];
      id: string;
      order_refund_id: string;
      quantity: number;
      reason_code: string;
      refund_state: string;
      shipping_amount: number;
      shipping_taxes: any[];
      state: string;
      taxes: any[];
      transaction_date: string;
      transaction_number: string;
    }>;
    shipped_date: string;
    shipping_from: {
      address: {
        city: string | null;
        country_iso_code: string | null;
        state: string | null;
        street_1: string | null;
        street_2: string | null;
        zip_code: string | null;
      };
      warehouse: string | null;
    };
    shipping_price: number;
    shipping_price_additional_unit: number | null;
    shipping_price_unit: number | null;
    shipping_taxes: any[];
    taxes: any[];
    total_commission: number;
    total_price: number;
  }>;
  order_refunds: any;
  order_state: string;
  order_state_reason_code: string | null;
  order_state_reason_label: string | null;
  order_tax_mode: string;
  order_taxes: any;
  paymentType: string;
  payment_type: string;
  payment_workflow: string;
  price: number;
  promotions: {
    applied_promotions: any[];
    total_deduced_amount: number;
  };
  quote_id: string | null;
  shipping_carrier_code: string;
  shipping_carrier_standard_code: string;
  shipping_company: string;
  shipping_deadline: string;
  shipping_price: number;
  shipping_pudo_id: string | null;
  shipping_tracking: string;
  shipping_tracking_url: string;
  shipping_type_code: string;
  shipping_type_label: string;
  shipping_type_standard_code: string | null;
  shipping_zone_code: string;
  shipping_zone_label: string;
  total_commission: number;
  total_price: number;
  transaction_date: string;
  transaction_number: string;
}

export interface EmpikOrdersResponse {
  orders: EmpikOrder[];
  total_count: number;
}

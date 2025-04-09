import { CREDIT_PACKAGES } from "@shared/schema";
import fetch from 'node-fetch';

interface CreateOrderResponse {
  id: string;
  status: string;
  links: Array<{
    href: string;
    rel: string;
    method: string;
  }>;
}

interface CaptureOrderResponse {
  id: string;
  status: string;
  payer: {
    email_address: string;
    payer_id: string;
    name: {
      given_name: string;
      surname: string;
    };
  };
  purchase_units: Array<{
    reference_id: string;
    amount: {
      currency_code: string;
      value: string;
    };
    payee: {
      email_address: string;
      merchant_id: string;
    };
  }>;
  payment_source: {
    paypal: {
      account_id: string;
      email_address: string;
      name: {
        given_name: string;
        surname: string;
      };
      account_status: string;
    };
  };
}

// PayPal base URLs - using sandbox for development, switch to production URL for production
const PAYPAL_BASE_URL = 'https://api-m.sandbox.paypal.com'; // Use https://api-m.paypal.com for production

// PayPal client ID and secret from user's developer account
const PAYPAL_CLIENT_ID = 'AQYknfyNGvnG2UN6uViGCmBmE9jdKm9VGe1flNS3XhFVbVr9kC545z4ec7jHnpRTpPaZ6Fy78Q8XqOWS'; 
const PAYPAL_SECRET = 'EMyvLQCI8yV6uX2WDJpNORscJwsLIhWT1g74HTrPOdKfLOg5YT_X8-bFw5DEPctm7GSmSgVHla_pIMXN';

/**
 * Generate an access token for the PayPal API
 * @returns {Promise<string>} The access token
 */
async function generateAccessToken(): Promise<string> {
  try {
    // Make a real API call to PayPal
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString('base64');
    const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${auth}`
      },
      body: 'grant_type=client_credentials'
    });
    
    const data = await response.json() as any;
    
    if (!response.ok) {
      console.error('PayPal token error:', data);
      throw new Error(data.error_description || 'Failed to generate access token');
    }
    
    return data.access_token;
  } catch (error) {
    console.error('Error generating PayPal access token:', error);
    throw new Error('Failed to generate PayPal access token');
  }
}

/**
 * Create a PayPal order
 * @param packageId The ID of the credit package
 * @param userId The ID of the user making the purchase
 * @returns {Promise<CreateOrderResponse>} The created order
 */
export async function createPayPalOrder(packageId: number, userId: number): Promise<CreateOrderResponse> {
  try {
    const creditPackage = CREDIT_PACKAGES.find(pkg => pkg.id === packageId);
    
    if (!creditPackage) {
      throw new Error("Invalid package selected");
    }
    
    // Get access token
    const accessToken = await generateAccessToken();
    
    // Make a real API call to PayPal's create order endpoint
    const response = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            reference_id: `DreamForge-${userId}-${packageId}`,
            description: `${creditPackage.name} - ${creditPackage.credits} Credits`,
            custom_id: `user-${userId}-package-${packageId}`,
            amount: {
              currency_code: 'USD',
              value: creditPackage.price.toFixed(2)
            }
          }
        ],
        application_context: {
          brand_name: 'DreamForge AI',
          landing_page: 'BILLING',
          user_action: 'PAY_NOW',
          return_url: 'https://dreamforge.app/payment-success',
          cancel_url: 'https://dreamforge.app/payment-cancel'
        }
      })
    });
    
    const data = await response.json() as any;
    
    if (!response.ok) {
      console.error('PayPal order creation error:', data);
      throw new Error(data.error_description || 'Failed to create PayPal order');
    }
    
    return data as CreateOrderResponse;
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    throw new Error('Failed to create PayPal order');
  }
}

/**
 * Capture a PayPal order after user approval
 * @param orderId The ID of the order to capture
 * @returns {Promise<CaptureOrderResponse>} The capture result
 */
export async function capturePayPalOrder(orderId: string): Promise<CaptureOrderResponse> {
  try {
    // Get access token
    const accessToken = await generateAccessToken();
    
    // Make a real API call to PayPal's capture order API
    const response = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    const data = await response.json() as any;
    
    if (!response.ok) {
      console.error('PayPal capture error:', data);
      throw new Error(data.error_description || 'Failed to capture PayPal payment');
    }
    
    return data as CaptureOrderResponse;
  } catch (error) {
    console.error('Error capturing PayPal order:', error);
    throw new Error('Failed to capture PayPal payment');
  }
}

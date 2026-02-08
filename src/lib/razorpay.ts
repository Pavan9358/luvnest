declare global {
    interface Window {
        Razorpay: any;
    }
}

export const loadRazorpay = (): Promise<boolean> => {
    return new Promise((resolve) => {
        if (window.Razorpay) {
            resolve(true);
            return;
        }
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => {
            resolve(true);
        };
        script.onerror = () => {
            resolve(false);
        };
        document.body.appendChild(script);
    });
};

interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    image?: string;
    order_id?: string;
    prefill?: {
        name?: string;
        email?: string;
        contact?: string;
    };
    handler?: (response: any) => void;
    theme?: {
        color: string;
    };
}

export const openRazorpay = (options: RazorpayOptions) => {
    if (!window.Razorpay) {
        console.error("Razorpay SDK not loaded");
        return;
    }
    const rzp = new window.Razorpay(options);
    rzp.open();
};

"use client";

import { createNewSubscription } from "@/actions/payment.action";
import { Logo } from "@/config/Logo";
import { Button, Input, Radio, RadioGroup } from "@heroui/react";
import { Icon } from "@iconify/react";
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

// Import react-select and the country list helper
import Select from "react-select";
import countryList from "react-select-country-list";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const Subscribe = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

const CheckoutForm = () => {
  // Use next-themes hook and add a mounted state so that the theme is defined on the client
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const { data, update } = useSession();
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  // Customer details including additional fields for export transactions
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [addressLine1, setAddressLine1] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [postalCode, setPostalCode] = useState<string>("");
  const [country, setCountry] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize country options using react-select-country-list
  const countryOptions = countryList().getData();
  const handleCountryChange = (
    selectedOption: { label: string; value: string } | null
  ) => {
    setCountry(selectedOption ? selectedOption.value : "");
  };

  // Define custom styles for react-select based on the theme
  const customSelectStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: resolvedTheme === "dark" ? "#333" : "#fff",
      borderColor:
        state.isFocused ? (resolvedTheme === "dark" ? "#fff" : "#000") : provided.borderColor,
      color: resolvedTheme === "dark" ? "#fff" : "#000",
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: resolvedTheme === "dark" ? "#333" : "#fff",
      color: resolvedTheme === "dark" ? "#fff" : "#000",
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isFocused
        ? (resolvedTheme === "dark" ? "#444" : "#f0f0f0")
        : resolvedTheme === "dark"
        ? "#333"
        : "#fff",
      color: resolvedTheme === "dark" ? "#fff" : "#000",
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: resolvedTheme === "dark" ? "#fff" : "#000",
    }),
  };

  // Ensure we have the session email (and optionally name) from the user session
  useEffect(() => {
    if (data?.user) {
      setEmail(data.user.email!);
      if (data.user.name) setName(data.user.name);
    }
  }, [data]);

  // Show any errors as a toast
  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  // Don't render until after mounting (so resolvedTheme is defined)
  if (!mounted) {
    return null;
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);

    const cardElements = elements.getElement(CardElement);

    try {
      // Create a payment method including the additional billing details
      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElements!,
        billing_details: {
          email,
          name,
          address: {
            line1: addressLine1,
            city,
            postal_code: postalCode,
            country, // Two-letter country code (e.g. "IN" for India, "US" for United States)
          },
        },
      });

      if (error) {
        setError(error.message || "An error occurred");
        setLoading(false);
        return;
      }

      const res = await createNewSubscription(email, paymentMethod!.id);

      if (res?.error) {
        setError(res.error?.message);
        setLoading(false);
        return;
      }

      if (res?.subscription) {
        // Check if additional authentication (e.g., 3D Secure) is required
        const paymentIntent = res.subscription.latest_invoice.payment_intent;
        if (paymentIntent && paymentIntent.status === "requires_action") {
          const { error: confirmError } = await stripe.confirmCardPayment(
            paymentIntent.client_secret
          );
          if (confirmError) {
            setError(confirmError.message || "Authentication failed");
            setLoading(false);
            return;
          }
        }
        setLoading(false);
        const updateSession = await update({
          subscription: {
            id: res.subscription.id,
            status: res.subscription.status,
          },
        });
        if (updateSession) {
          toast.success("Subscription successful! Please sign in again to access your premium features.");
          // Sign out the user and redirect to sign-in page
          signOut({ callbackUrl: '/signin' });
        }
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-large">
        <div className="flex flex-col items-center pb-6">
          <Logo />
          <p className="text-xl font-medium">Subscribe</p>
          <p className="text-small text-default-500">
            Enter your email, card details, and your information to subscribe
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5" key={resolvedTheme}>
          <RadioGroup isDisabled label="Your Plan" defaultValue={"5000"}>
            <Radio value="5000">₹5000 per month</Radio>
          </RadioGroup>

          <Input
            type="email"
            label="Email Address"
            placeholder="Email"
            variant="bordered"
            value={email}
            isDisabled
          />

          <Input
            type="text"
            label="Full Name"
            placeholder="Your Name"
            variant="bordered"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            type="text"
            label="Address Line 1"
            placeholder="Address Line 1"
            variant="bordered"
            value={addressLine1}
            onChange={(e) => setAddressLine1(e.target.value)}
          />

          <Input
            type="text"
            label="City"
            placeholder="City"
            variant="bordered"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />

          <Input
            type="text"
            label="Postal Code"
            placeholder="Postal Code"
            variant="bordered"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
          />

          {/* Country Dropdown */}
          <div>
            <label className="block mb-1 text-sm font-medium">Country</label>
            <Select
              options={countryOptions}
              value={countryOptions.find(
                (option: { value: string }) => option.value === country
              )}
              onChange={handleCountryChange}
              placeholder="Select Country"
              styles={customSelectStyles}
            />
          </div>

          <div className="my-4">
            <CardElement
              key={resolvedTheme} // Forces a remount when the theme changes
              options={{
                hidePostalCode: true,
                style: {
                  base: {
                    backgroundColor: resolvedTheme === "dark" ? "#000" : "#fff",
                    color: resolvedTheme === "dark" ? "#fff" : "#000",
                  },
                  invalid: {
                    color: "#ef2961",
                  },
                },
              }}
            />
          </div>

          <Button
            className="w-full"
            color="primary"
            type="submit"
            startContent={<Icon icon="solar:card-send-bold" fontSize={19} />}
            isDisabled={!stripe || loading}
          >
            {loading ? "Processing..." : "Subscribe"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Subscribe;

"use client";

import React from "react";

import { cancelUserSubscription } from "@/actions/payment.action";
import { IUser } from "@/backend/models/user.model";
import { Logo } from "@/config/Logo";
import { Button, Input, Radio, RadioGroup } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const Unsubscribe = () => {
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const { data, update } = useSession();
  const user = data?.user as IUser;

  const handleUnsubscribe = async () => {
    setLoading(true);

    const res = await cancelUserSubscription(user.email);

    setLoading(false);

    if (res?.error) {
      return toast.error(res.error?.message);
    }

    if (res?.status) {
      const updateSession = await update({
        subscription: {
          status: res.status,
        },
      });

      if (updateSession) {
        toast.success("Subscription cancelled successfully");
        router.push("/");
      }
    }
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-large">
        <div className="flex flex-col items-center pb-6">
          <Logo />
          <p className="text-xl font-medium">Unsubscribe</p>
          <p className="text-small text-default-500">
            Unsubscribe from your current plan
          </p>
        </div>

        <div className="flex flex-col gap-5">
          <RadioGroup isDisabled label="Your Plan" defaultValue={"5000"}>
            <Radio value="5000">₹5000 per month</Radio>
          </RadioGroup>

          <Input
            type="email"
            label="Email Address"
            placeholder="Email"
            variant="bordered"
            value={user?.email}
            isDisabled
          />

          <Button
            className="w-full"
            color="danger"
            type="submit"
            startContent={<Icon icon="solar:card-recive-bold" fontSize={19} />}
            onPress={handleUnsubscribe}
            isLoading={loading}
            isDisabled={loading}
          >
            UnSubscribe
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unsubscribe;

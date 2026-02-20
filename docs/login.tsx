import { Button } from "@/components/ui/button";
import ScreenLoader from "@/components/ui/loader/screen-loader";
import { apiRequest, loginRequest } from "@/config/auth-config";
import { useLogin } from "@/hooks/auth/useLogin";
import { useMsal } from "@azure/msal-react";
import helixLogo from "@images/background/helix-logo-big.svg";
import loginImage from "@images/background/login-side-img.png";
import akerLogo from "@images/brand/aker-logo.png";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    const token = context.token;
    if (token) {
      throw redirect({ to: "/dashboard" });
    }
  },
});

function RouteComponent() {
  const { instance } = useMsal();
  const { mutate, isPending } = useLogin();

  const handleLoginRedirect = async () => {
    await instance.loginPopup(loginRequest);

    // .then(async (res) => {
    //   if (res.accessToken) {
    //     mutate(res.accessToken);
    //   }
    // });

    const account = instance.getActiveAccount();
    if (account) {
      const tokenResponse = await instance.acquireTokenSilent({
        ...apiRequest,
        account: account,
      });
      mutate(tokenResponse.accessToken);
    }
  };

  return (
    <div className="p-4 box-border h-screen min-h-[600px] bg-white text-black">
      <section className="flex flex-wrap h-full">
        <section className="w-1/2 flex flex-col justify-between">
          <div>
            <img src={akerLogo} alt="aker logo" />
          </div>
          <div className="flex flex-col gap-10 items-start">
            <div>
              <p className=" text-[74px] font-bold mb-2 font-solutioneer">
                Welcome to Helix
              </p>
              <p className="font-helvetica">
                HELIX is a next‑generation platform transforming maintenance
                <br />
                engineering across projects and services. With a modern,
                intuitive <br /> interface and scalable architecture, HELIX
                boosts efficiency, <br /> collaboration and decision quality.
              </p>
            </div>
            <Button
              onClick={handleLoginRedirect}
              className="bg-white w-[165px] h-[48px]"
              variant={"outline"}
            >
              Sign In
            </Button>
          </div>
          <div>
            <div className="font-helvetica">
              <p className="font-medium tracking-wide ">
                Having trouble signing in?{" "}
              </p>
              <p className="underline font-light tracking-wider">Click Here</p>
            </div>
            <p className="flex font-helvetica mt-10 text-sm">
              Developed by DigiHub, Mumbai, Aker Solutions
            </p>
          </div>
        </section>
        <section className="w-1/2 h-full relative">
          <img className="w-full h-full" src={loginImage} alt="login-image" />
          <img
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-2/6 w-auto"
            src={helixLogo}
            alt="helix logo"
          />
          <div className="bg-white aspect-square  w-1/4  absolute bottom-0 right-0"></div>
        </section>
      </section>
      <ScreenLoader open={isPending} />
    </div>
  );
}

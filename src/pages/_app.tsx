import "@/styles/globals.css";
import "@/styles/employee-info-global.css"
import "@/styles/employee-information.css"
import "@/styles/employee-profile.css"
import type { AppProps } from "next/app";
import { ChakraProvider, Box } from "@chakra-ui/react";
import { useRouter } from "next/router";
import Navbar from "../components/navbar";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const noNavbarRoutes = ["/login"];
  const isLoginPage = router.pathname === "/login";

  const shouldShowNavbar = !noNavbarRoutes.includes(router.pathname);
  const backgroundColor = isLoginPage ? "#FFCF50" : "#FAF6C7";

  return (
    <ChakraProvider>
      <Box bg={backgroundColor} minHeight="100vh">
        {shouldShowNavbar && <Navbar />}
        <Box p={4}>
          <Component {...pageProps} />
        </Box>
      </Box>
    </ChakraProvider>
  );
}

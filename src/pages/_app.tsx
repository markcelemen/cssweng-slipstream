import "@fontsource/inter";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider, Box } from "@chakra-ui/react";
import { useRouter } from "next/router";
import Navbar from "../components/navbar";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const noNavbarRoutes = ["/login"];
  const isLoginPage = router.pathname === "/login";
  const isEmployeetable = router.pathname === "/employeetable";

  const shouldShowNavbar = !noNavbarRoutes.includes(router.pathname);
  const backgroundColor = isLoginPage ? "#FFCF50" : "#FAF6C7";
  
  const bgStyle = isEmployeetable
    ? {
        backgroundColor: "#FAF6C7",
        backgroundImage: "url('/rainbow.png')", 
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "bottom right",
      }
    : { backgroundColor };

  return (
    <ChakraProvider>
      <Box style={bgStyle} minHeight="100vh">
        {shouldShowNavbar && <Navbar />}
        <Box p={4}>
          <Component {...pageProps} />
        </Box>
      </Box>
    </ChakraProvider>
  );
}

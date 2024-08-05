import { useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  Link,
} from "@nextui-org/react";

export const Logo = () => (
  <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
    <path
      clipRule="evenodd"
      d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </svg>
);

export default function NavigationbarComp() {
  const [activeTab, setActiveTab] = useState<string>("home");

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <Navbar
      isBordered
      maxWidth="full"
      isBlurred={false}
      className="bg-custom-dark border-custom-silver"
    >
      <NavbarBrand>
        <Logo />
        <Link
          color="foreground"
          href="/home"
          onPress={() => handleTabClick("home")}
          className={`nav-link ${
            activeTab === ""
              ? "border-custom-silver border-b-2 text-custom-yellow"
              : ""
          }`}
        >
          <p className="font-bold text-inherit cursor-pointer">
            One Piece Builder
          </p>
        </Link>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem isActive={activeTab === "cards"}>
          <Link
            color="foreground"
            href="/cards"
            onPress={() => handleTabClick("cards")}
            className={`nav-link ${
              activeTab === "cards"
                ? "border-custom-silver border-b-2 text-custom-yellow"
                : ""
            }`}
          >
            Card List
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            color="foreground"
            href="/builder"
            onPress={() => handleTabClick("builder")}
            className={`nav-link ${
              activeTab === "builder"
                ? "border-custom-silver border-b-2 text-custom-yellow"
                : ""
            }`}
          >
            Deck Builder
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            color="foreground"
            href="/decks"
            onPress={() => handleTabClick("decks")}
            className={`nav-link ${
              activeTab === "decks"
                ? "border-custom-silver border-b-2 text-custom-yellow"
                : ""
            }`}
          >
            Hot Decks
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <Link href="#">Login</Link>
        </NavbarItem>
        <NavbarItem>
          <Button as={Link} color="primary" href="#" variant="flat">
            Sign Up
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}

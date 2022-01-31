import { ReactNode, useEffect } from "react"
import { Head, Link, Routes } from "blitz"
import CookieConsent, { Cookies, getCookieConsentValue } from "react-cookie-consent"
import { Toaster } from "react-hot-toast"
import Footer from "../components/Footer"

type LayoutProps = {
  title?: string
  children: ReactNode
  headChildren?: ReactNode
}

const Layout = ({ title, children, headChildren }: LayoutProps) => {
  // useEffect(() => {
  //   if (getCookieConsentValue("researchequals-website-cookie") === "true") {
  //   }
  // }, [])

  return (
    <>
      <Toaster position="bottom-center" reverseOrder={false} />
      <Head>
        <title>{title || "ResearchEquals"}</title>
        <link rel="icon" href="/favicon-32.png" />
        <script data-respect-dnt data-no-cookie async src="https://cdn.splitbee.io/sb.js"></script>
        {headChildren}
      </Head>
      <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <div className="flex-grow">{children}</div>
      </div>
      <Footer />
      <CookieConsent
        location="bottom"
        style={{
          background: "#4f46e5",
          fontSize: "1rem",
          left: "50",
          maxWidth: "100%",
          borderTop: "1px solid #fff",
        }}
        buttonText="Consent"
        declineButtonText="Decline"
        cookieName="researchequals-website-cookie"
        buttonStyle={{
          backgroundColor: "#059669",
          color: "#fff",
          fontSize: "1rem",
        }}
        declineButtonStyle={{
          backgroundColor: "#db2777",
          color: "#fff",
          fontSize: "1rem",
        }}
        expires={150}
        onAccept={() => {}}
        enableDeclineButton
      >
        We use cookies for essential website security purposes. You can withdraw your consent for
        optional cookies at any time. See also our{" "}
        <Link href={Routes.PrivacyPage()}>
          <a className="hover:no-underline hover:text-white underline" target="_blank">
            Privacy policy
          </a>
        </Link>
        .
      </CookieConsent>
    </>
  )
}

export default Layout

import Layout from "../components/Layout";
import { useState } from "react";

const IndexPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setIsError(false);

    try {
      const response = await fetch("/api/notify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      // Server errors can be HTML or raw provider text, so visitors only see
      // the API's own message for problems they can fix themselves.
      if (response.status >= 500) {
        throw new Error("Server error");
      }

      const result = await response.json();

      setMessage(result.message);
      setIsError(!response.ok);

      if (response.ok) {
        setEmail("");
      }
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Coming Soon | Upsworth PMS">
      <img
        src="/images/xera.svg"
        alt="Coming Soon | Upsworth PMS"
        className="relative flex-shrink-0 mt-4 -mb-6 h-figure lg:absolute lg:m-0 lg:h-96 lg:right-5 lg:top-10 short:absolute short:m-0 short:h-28 short:top-6 short:right-0 animate-blob"
      />
      <img
        src="/images/shapes.svg"
        alt="hero"
        className="absolute w-full left-0 bottom-16 opacity-60 sm:left-24 sm:bottom-24 sm:opacity-100 pointer-events-none animate-blob2"
      />
      <div className="relative z-10 w-full my-auto px-6 sm:px-10 py-6 lg:pt-20 lg:pb-0 short:py-4 space-y-8 sm:space-y-16 lg:space-y-32 short:space-y-5 text-gray-900">
        <div className="text-center space-y-4 sm:space-y-10 short:space-y-3">
          <h3 className="font-light text-base sm:text-xl short:text-sm uppercase tracking-wider">
            Coming soon
          </h3>
          <h1 className="text-hero lg:text-7xl xl:text-8xl lg:leading-none short:text-3xl font-extrabold">Something <span className="whitespace-nowrap">big is coming</span></h1>
          <p className="text-lg sm:text-xl lg:text-2xl short:text-base tracking-wide max-w-[17rem] sm:max-w-xl short:max-w-sm mx-auto">
            We’re under construction. Check back soon for updates. Stay in
            touch!
          </p>
        </div>
        <div className="relative z-10 w-full max-w-sm sm:max-w-xl short:max-w-xl mx-auto">
          <form className="relative z-10" onSubmit={handleSubmit}>
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              aria-label="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="info@upsworth-pms.com"
              className="w-full text-lg sm:text-2xl short:text-lg font-light text-gray-900 placeholder-gray-500 py-4 px-5 sm:py-5 sm:pr-40 lg:pr-48 short:py-3 short:pr-40 rounded-xl"
            />
            <button className="w-full mt-3 py-4 sm:w-auto sm:mt-0 sm:py-0 sm:absolute sm:top-1 sm:right-1 sm:bottom-1 short:w-auto short:mt-0 short:py-0 short:absolute short:top-1 short:right-1 short:bottom-1 px-4 lg:px-10 text-lg sm:text-xl short:text-base font-semibold bg-gray-900 text-white rounded-xl transition ease-in-out duration-500 hover:bg-red-500" disabled={loading}>
               {loading ? "Sending..." : "Notify me"}
            </button>
          </form>
          <p
            role="status"
            className={`text-center text-base sm:text-lg short:text-sm font-medium ${
              message ? "mt-3 py-2 px-4 rounded-xl bg-white bg-opacity-90" : ""
            } ${isError ? "text-red-700" : "text-green-700"}`}
          >
            {message}
          </p>
        </div>
      </div>
      <div className="relative z-10 flex-shrink-0 pt-4 pb-5 short:pt-0 short:pb-3">
        <ul className="flex space-x-3">
          <li>
            <a
              href="https://www.instagram.com/upsworth_project_management"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex items-center justify-center w-11 h-11 lg:w-10 lg:h-10 rounded-full bg-gray-50 transition ease-in-out duration-500 hover:bg-red-500 hover:text-white hover:shadow-lg"
            >
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </a>
          </li>
          <li>
            <a
              href="https://www.facebook.com/share/19grDZyaam/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="flex items-center justify-center w-11 h-11 lg:w-10 lg:h-10 rounded-full bg-gray-50 transition ease-in-out duration-500 hover:bg-red-500 hover:text-white hover:shadow-lg"
            >
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </a>
          </li>
        </ul>
      </div>
    </Layout>
  )};

export default IndexPage;

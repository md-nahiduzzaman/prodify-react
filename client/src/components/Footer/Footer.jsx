import Container from "../Container";

const Footer = () => {
  return (
    <div>
      <div className="border-t">
        <Container>
          <footer className="bg-white dark:bg-gray-900  ">
            <div className="flex flex-col items-center justify-between px-6 py-8 mx-auto lg:flex-row">
              <a className="text-2xl font-medium">Prodify</a>

              <div className="flex flex-wrap items-center justify-center gap-4 mt-6 lg:gap-6 lg:mt-0">
                <a
                  href="#"
                  className="text-sm text-gray-600 transition-colors duration-300 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400"
                >
                  Help
                </a>

                <a
                  href="#"
                  className="text-sm text-gray-600 transition-colors duration-300 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400"
                >
                  Privacy
                </a>
              </div>

              <p className="mt-6 text-sm text-gray-500 lg:mt-0 dark:text-gray-400">
                © Copyright 2024 Prodify.{" "}
              </p>
            </div>
          </footer>
        </Container>
      </div>
    </div>
  );
};

export default Footer;

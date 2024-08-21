import Container from "../../components/Container";

const Home = () => {
  return (
    <>
      <Container>
        <div className="flex flex-col sm:flex-row border-t pt-10">
          {/* filter */}
          <div className="min-w-60 pr-10 h-screen border-r-2">
            <p>Filters</p>
            <div className="hidden lg:block w-[280px] max-w-[280px]">
              {/* Category Section */}
              <div className="mb-2 w-full">
                <div className="navbar-center hidden lg:flex w-full">
                  <div className="form-control w-full">
                    <input
                      type="text"
                      placeholder="Search"
                      className="input input-bordered w-full md:w-full"
                    />
                  </div>
                </div>
              </div>
              <div className="mb-2">
                <div className="bg-white rounded-lg shadow-md p-2">
                  <div className="flex justify-between items-center cursor-pointer border-b border-[#eee] py-2">
                    <p className="text-[#111] text-[17px]">Category</p>
                  </div>
                  <div className="mt-2 space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox text-indigo-600 h-4 w-4"
                        value="Laptops"
                      />
                      <span className="ml-2 text-[14px] text-[#111]">Male</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox text-indigo-600 h-4 w-4"
                        value="Phones"
                      />
                      <span className="ml-2 text-[14px] text-[#111]">
                        Female
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Brand Section */}
              <div className="mb-2">
                <div className="bg-white rounded-lg shadow-md p-2">
                  <div className="flex justify-between items-center cursor-pointer border-b border-[#eee] py-2">
                    <p className="text-[#111] text-[17px]">Brand</p>
                  </div>
                  <div className="mt-2 space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox text-indigo-600 h-4 w-4"
                        value="Apple"
                      />
                      <span className="ml-2 text-[14px] text-[#111]">
                        Zeera
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* category filter */}
          </div>
          <div></div>
          {/* products */}
          <div className="pl-10">products</div>
        </div>
      </Container>
    </>
  );
};

export default Home;

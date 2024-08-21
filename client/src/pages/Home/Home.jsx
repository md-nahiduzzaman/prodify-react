import React, { useState, useEffect } from "react";
import axios from "axios";
import Container from "../../components/Container";
import ProductCard from "../../components/ProductCard/ProductCard";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState([]);
  const [brand, setBrand] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortOption, setSortOption] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/products`,
          {
            params: {
              page: currentPage,
              limit: 8,
              search: searchTerm,
              category: category.join(","),
              brand: brand.join(","),
              minPrice,
              maxPrice,
              sort: sortOption,
            },
          }
        );
        setProducts(response.data.products);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [
    currentPage,
    searchTerm,
    category,
    brand,
    minPrice,
    maxPrice,
    sortOption,
  ]);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to first page when search term changes
  };

  const handleCategoryChange = (event) => {
    const value = event.target.value;
    setCategory((prev) =>
      prev.includes(value)
        ? prev.filter((cat) => cat !== value)
        : [...prev, value]
    );
    setCurrentPage(1); // Reset to first page when category changes
  };

  const handleBrandChange = (event) => {
    const value = event.target.value;
    setBrand((prev) =>
      prev.includes(value)
        ? prev.filter((br) => br !== value)
        : [...prev, value]
    );
    setCurrentPage(1); // Reset to first page when brand changes
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  return (
    <Container>
      <div className="flex flex-col sm:flex-row border-t pt-10">
        {/* Filter Section */}
        <div className="min-w-60 pr-10 h-screen border-r-2">
          <p className="text-xl font-semibold mb-4">Filters</p>
          <div className="hidden lg:block w-[280px] max-w-[280px]">
            {/* Search Input */}
            <div className="mb-4 w-full">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={handleSearchChange}
                className="input input-bordered w-full md:w-full"
              />
            </div>

            {/* Category Filter */}
            <div className="mb-4">
              <div className="bg-white rounded-lg shadow-md p-2">
                <div className="flex justify-between items-center cursor-pointer border-b border-[#eee] py-2">
                  <p className="text-[#111] text-[17px]">Category</p>
                </div>
                <div className="mt-2 space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox text-indigo-600 h-4 w-4"
                      value="Electronics"
                      checked={category.includes("Electronics")}
                      onChange={handleCategoryChange}
                    />
                    <span className="ml-2 text-[14px] text-[#111]">
                      Electronics
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox text-indigo-600 h-4 w-4"
                      value="Phones"
                      checked={category.includes("Phones")}
                      onChange={handleCategoryChange}
                    />
                    <span className="ml-2 text-[14px] text-[#111]">Phones</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox text-indigo-600 h-4 w-4"
                      value="Accessories"
                      checked={category.includes("Accessories")}
                      onChange={handleCategoryChange}
                    />
                    <span className="ml-2 text-[14px] text-[#111]">
                      Accessories
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Brand Filter */}
            <div className="mb-4">
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
                      checked={brand.includes("Apple")}
                      onChange={handleBrandChange}
                    />
                    <span className="ml-2 text-[14px] text-[#111]">Apple</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox text-indigo-600 h-4 w-4"
                      value="Samsung"
                      checked={brand.includes("Samsung")}
                      onChange={handleBrandChange}
                    />
                    <span className="ml-2 text-[14px] text-[#111]">
                      Samsung
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox text-indigo-600 h-4 w-4"
                      value="Sony"
                      checked={brand.includes("Sony")}
                      onChange={handleBrandChange}
                    />
                    <span className="ml-2 text-[14px] text-[#111]">Sony</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="mb-4">
              <div className="bg-white rounded-lg shadow-md p-2">
                <div className="flex justify-between items-center cursor-pointer border-b border-[#eee] py-2">
                  <p className="text-[#111] text-[17px]">Price Range</p>
                </div>
                <div className="mt-2 space-y-2">
                  <input
                    type="number"
                    placeholder="Min Price"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="input input-bordered w-full"
                  />
                  <input
                    type="number"
                    placeholder="Max Price"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="input input-bordered w-full mt-2"
                  />
                </div>
              </div>
            </div>

            {/* Sort By */}
            <div className="mb-4">
              <div className="bg-white rounded-lg shadow-md p-2">
                <div className="flex justify-between items-center cursor-pointer border-b border-[#eee] py-2">
                  <p className="text-[#111] text-[17px]">Sort By</p>
                </div>
                <select
                  id="input-sort"
                  value={sortOption}
                  onChange={handleSortChange}
                  className="form-select w-full mt-2"
                >
                  <option value="">Default</option>
                  <option value="price-ASC">Price (Low to High)</option>
                  <option value="price-DESC">Price (High to Low)</option>
                  <option value="dateAdded-ASC">
                    Date Added (Oldest first)
                  </option>
                  <option value="dateAdded-DESC">
                    Date Added (Newest first)
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="pl-10">
          <h2 className="text-2xl font-semibold mb-4">Products</h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          {/* Pagination */}
          <div className="mt-4 flex justify-center items-center mb-10">
            <button
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="px-4 py-2 border border-gray-300 rounded-md bg-white text-black hover:bg-gray-100"
            >
              Previous
            </button>
            <span className="mx-2 text-lg">{`Page ${currentPage} of ${totalPages}`}</span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="px-4 py-2 border border-gray-300 rounded-md bg-white text-black hover:bg-gray-100"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Home;

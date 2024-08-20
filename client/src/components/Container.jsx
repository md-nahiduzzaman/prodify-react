const Container = ({ children }) => {
  return (
    <div className="max-w-[2520px] mx-auto sm:px-2 md:px-10 xl:px-20 px-4">
      {children}
    </div>
  );
};

export default Container;

const CornerElements = () => {
  return (
    <>
      <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-primary/40 rounded-tl-lg"></div>
      <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-primary/40 rounded-tr-lg"></div>
      <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-primary/40 rounded-bl-lg"></div>
      <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-primary/40 rounded-br-lg"></div>
    </>
  );
};

export default CornerElements;
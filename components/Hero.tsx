const Hero = () => {
  return (
    <>
      <div className="container">
        <h1>raecreatedit</h1>
        <h2>I make things.</h2>
      </div>

      <style jsx>
        {`
          .container {
            width: 100%;
            height: calc(100vh - 100px);
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
        `}
      </style>
    </>
  );
};

export default Hero;

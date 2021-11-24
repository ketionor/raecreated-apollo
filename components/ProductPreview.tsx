import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "./AddToCartButton";
import QuanititySelector from "./QuanititySelector";

interface ProductPreview {
  slug: string;
  featuredImage: string;
  title: string;
  price: string;
  id: string;
}

const ProductPreview = ({
  slug,
  featuredImage,
  title,
  price,
  id,
}: ProductPreview) => {
  const [quantity, setQuantity] = useState<number>(1);

  const handleChangeQuantity = (e) => {
    setQuantity(e.target.value);
  };

  return (
    <>
      <div className="single-product">
        <Link href={`/products/${slug}`} passHref>
          <div className="inner-product-container">
            <Image
              height={100}
              width={100}
              layout="responsive"
              src={featuredImage}
            />
            <h1>{title}</h1>
            <h2>{price}</h2>
          </div>
        </Link>
        <QuanititySelector quantity={quantity} setQuantity={setQuantity} />
        <AddToCartButton id={id} quantity={quantity} />
      </div>
    </>
  );
};

export default ProductPreview;

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

  return (
    <>
      <div className="single-product">
        <Link href={`/products/${slug}`} passHref>
          <div className="inner-product-container">
            <Image
              height={1}
              width={1}
              layout="responsive"
              src={featuredImage}
            />
            <div className="title-container">
              <p className="price">{`$${price}0`}</p>
              <p className="title">{title}</p>
            </div>
          </div>
        </Link>
        <div className="add-to-cart">
          <QuanititySelector quantity={quantity} setQuantity={setQuantity} />
          <AddToCartButton id={id} quantity={quantity} />
        </div>
      </div>

      <style jsx>
        {`
          .single-product {
            width: 100%;
            margin-bottom: 1rem;
          }

          .title-container {
            margin-top: 0.5rem;
            margin-bottom: 0.5rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .price,
          .title {
            margin: 0;
            padding: 0;
          }

          .title {
            text-align: right;
            font-size: 1.5rem;
          }

          .add-to-cart {
            display: flex;
            justify-content: flex-end;
          }
        `}
      </style>
    </>
  );
};

export default ProductPreview;

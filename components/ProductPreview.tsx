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
      <div className="w-full mb-4">
        <Link href={`/products/${slug}`} passHref>
          <div className="">
            <Image
              height={1}
              width={1}
              layout="responsive"
              src={featuredImage}
              alt={title}
            />
            <div className="mt-2 mb-2 flex justify-between items-center">
              <p className=" text-sm">{`$${Number(price).toFixed(2)}`}</p>
              <p className="text-xl">{title}</p>
            </div>
          </div>
        </Link>
        <div className="flex items-center justify-between h-14">
          <span className="w-24 h-2/3">
            <QuanititySelector quantity={quantity} setQuantity={setQuantity} />
          </span>
          <span className="w-auto h-2/3">
            <AddToCartButton id={id} quantity={quantity} type="icon" />
          </span>
        </div>
      </div>
    </>
  );
};

export default ProductPreview;

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
      <div className="grid grid-cols-9 grid-flow-row gap-y-4">
        <Link href={`/products/${slug}`} passHref>
          <div className="col-start-1 col-span-9">
            <Image
              height={1}
              width={1}
              layout="responsive"
              src={featuredImage}
              alt={title}
              className="rounded-t-md"
            />
          </div>
        </Link>
        <p className="text-sm col-start-1 col-span-1 ml-2">{`$${Number(
          price
        ).toFixed(2)}`}</p>
        <p className="text-sm text-right col-start-2 md:col-start-4 col-span-8 row-span-2 mr-2">
          {title}
        </p>
        <span className="col-start-1 col-span-3 row-start-4 ml-2 mb-2">
          <QuanititySelector quantity={quantity} setQuantity={setQuantity} />
        </span>
        <span className="col-start-9 row-start-4 mr-2 mb-2">
          <AddToCartButton id={id} quantity={quantity} type="icon" />
        </span>
      </div>
    </>
  );
};

export default ProductPreview;

import cloneDeep from "lodash/cloneDeep";
import { Request } from "express";
import { IProduct, TRawProduct } from "./product.type";
import { uploadFiles } from "@utils/uploadFiles";

// Returns a tuple of the actual product and the collections where the product will inserted to
export const sanitizeProductData = async (
  data: TRawProduct
): Promise<[IProduct, string[]]> => {
  const productData: Partial<IProduct> = cloneDeep(data);
  const collections = data?.collections?.map((el) => el.value);

  productData.images = data?.images
    ? await Promise.all(
        data.images?.map(async (image) => {
          if (typeof image === "string") {
            return image;
          } else {
            const uploaded = (await uploadFiles([image])) as string[];
            return uploaded[0];
          }
        })
      )
    : [];

  return [productData as IProduct, collections!];
};

export const orderImages = (req: Request): TRawProduct["images"] => {
  let imageFiles = req?.files as TRawProduct["images"];
  imageFiles = Array.isArray(imageFiles) ? imageFiles : [];

  let images = req.body?.images?.map((el: any) => ({
    url: el.value,
    i: el.serial,
  }));

  images = Array.isArray(images) ? images : [];

  images = [...images, ...(imageFiles as Express.Multer.File[])];

  const orderedImages: TRawProduct["images"] = [];

  images.length > 0 &&
    images.forEach((image: any) => {
      if (image.i) {
        orderedImages[Number(image.i)] = image.url;
      } else if (image.fieldname) {
        const regex = /^images\[(\d)\]\[value\]$/;

        const match = image.fieldname.match(regex);
        if (match[1]) {
          orderedImages[Number(match[1])] = image;
        }
      }
    });

  return orderedImages;
};

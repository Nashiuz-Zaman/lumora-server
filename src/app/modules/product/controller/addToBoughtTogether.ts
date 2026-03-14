import { catchAsync } from "@utils/catchAsync";
import { sendSuccess } from "@utils/sendSuccess";
import { addBoughtTogether } from "../service/addBoughtTogetherProducts";

export const addToBoughtTogetherController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { ids } = req.body;

  // Service handles validation and update
  await addBoughtTogether(id, ids);

  // Send response
  return sendSuccess(res, {
    message: "Frequently bought together products updated successfully",
  });
});

import React, { useState } from "react";
import {
  Button,
  Dialog,
  Typography,
  DialogBody,
} from "@material-tailwind/react";
import { editServicesAndProducts } from "@/firebase/firestore/servicesProducts";
import { IoClose } from "react-icons/io5";

function EditServicePopup({
  open,
  setOpen,
  data,
  rootprevious,
  beforeprevious,
  previous,
  type,
}) {
  const [editOption, setEditOption] = useState(null);
  const [editName, setEditName] = useState(null);
  const [editIcon, setEditIcon] = useState(null);
  let iconUrl;
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  const handleEdit = async () => {
    setOpen(false);
    data.map((item) => {
      if (item.id === editOption) {
        iconUrl = item.iconUrl;
      }
    });

    editServicesAndProducts(
      rootprevious,
      beforeprevious,
      previous,
      editOption,
      editName,
      editIcon,
      iconUrl,
      type
    );

    console.log("edited successfully");
  };
  const handleEditOption = (e) => {
    setEditOption(e.target.value);
  };
  const handleNameChange = (e) => {
    setEditName(e.target.value);
  };
  const handleIconChange = (e) => {
    setEditIcon(e.target.files[0]);
  };
  return (
    <>
      <Button onClick={handleOpen} className="bg-kaavi">
        Edit
      </Button>
      <Dialog
        open={open}
        handler={handleOpen}
        className="overflow-scroll"
        style={{ maxHeight: "calc(100vh - 200px)" }}
      >
        <DialogBody className="mx-auto w-full h-full font-inter">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <Typography variant="h4" color="blue-gray">
                Edit a {type}
              </Typography>
              <IoClose fontSize={30} onClick={handleClose} />
            </div>

            <Typography
              className="mb-3 font-normal"
              variant="paragraph"
              color="gray"
            >
              Enter details for the {type}.
            </Typography>
            <Typography className="-mb-2" variant="h6">
              Select the Service you want to change
            </Typography>
            <select
              name="servicename"
              id="name"
              value={editOption}
              onChange={handleEditOption}
              className="p-3 border-deep-orange-200 border rounded-md"
            >
              <option value="">Select any option</option>
              {data &&
                data.map((item, key) => (
                  <option key={key} value={item.id}>
                    {item.name}
                  </option>
                ))}
            </select>
            <Typography className="-mb-2" variant="h6">
              Name of the Service
            </Typography>
            <input
              type="text"
              value={editName}
              onChange={handleNameChange}
              className="border mb-5 p-1 border-deep-orange-200"
            />
            <Typography className="-mb-2" variant="h6">
              Give Icon
            </Typography>
            <input type="file" onChange={handleIconChange} />
          </div>

          <Button
            className="bg-kaavi text-white mt-8"
            type="submit"
            onClick={handleEdit}
            fullWidth
          >
            Enter
          </Button>
        </DialogBody>
      </Dialog>
    </>
  );
}

export default EditServicePopup;

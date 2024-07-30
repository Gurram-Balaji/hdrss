"use client";
import React, { useEffect, useState } from "react";
import {
  addGallery,
  addRamadass,
  deleteGalleryPhoto,
  getRamadass,
} from "@/firebase/firestore/ramadass";
import { Dialog, Typography, DialogBody } from "@material-tailwind/react";
import { IoClose } from "react-icons/io5";

function RamaDass() {
  const [leaderPhoto, setLeaderPhoto] = useState(null);
  const [leaderDetails, setLeaderDetails] = useState({});
  const [exisitingLeader, setExistingLeader] = useState();
  const [leaderGallery, setLeaderGallery] = useState([]);
  const [open, setOpen] = useState();
  const [photos, setPhotos] = useState();
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { id, value } = e.target;

    setLeaderDetails({
      ...leaderDetails,
      [id]: value,
    });
  };

  const handleLeader = async (e) => {
    e.preventDefault();
    await addRamadass(leaderDetails, leaderPhoto);
  };
  const handleDelete = async (photo) => {
    await deleteGalleryPhoto(photo);
  };
  const handleAddGallery = async () => {
    await addGallery(photos);
    setOpen(false);
  };
  useEffect(() => {
    const fetchData = async () => {
      const data = await getRamadass();
      setExistingLeader(data);
      setLeaderGallery(data.gallery);
    };
    fetchData();
  });

  return (
    <div className="flex flex-col justify-evenly items-start gap-y-4">
      <div>
        <p className="font-medium lg:text-lg">Enter the Name</p>
        <input
          type="text"
          placeholder="Name of the Leader"
          id="name"
          className="border-2 border-kaavi py-1 pl-1 pr-5 rounded-md"
          defaultValue={exisitingLeader && exisitingLeader.name}
          onChange={handleChange}
        />
      </div>
      <div>
        <p className="font-medium lg:text-lg">Enter about</p>
        <textarea
          type="text"
          placeholder="About the Leader"
          id="about"
          className="border-2 md:w-96 md:h-96 border-kaavi py-1 my-2 pl-1 pr-5 rounded-md"
          rows={4}
          cols={35}
          defaultValue={exisitingLeader && exisitingLeader.about}
          onChange={handleChange}
        />
      </div>
      <div>
        <p className="font-medium lg:text-lg">Enter the Youtube link</p>
        <input
          type="text"
          placeholder="Youtube video link"
          id="social"
          className="border-2 border-kaavi py-1 my-2 pl-1 pr-5 rounded-md"
          defaultValue={exisitingLeader && exisitingLeader.social}
          onChange={handleChange}
        />
      </div>
      <div className="flex justify-evenly gap-x-8">
        <div>
          <p className="font-medium lg:text-lg">Email Address</p>
          <input
            type="text"
            placeholder="Email Address"
            id="email"
            className="border-2 border-kaavi py-1 pl-1 pr-5 rounded-md"
            defaultValue={exisitingLeader && exisitingLeader?.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <p className="font-medium lg:text-lg">Mobile Number</p>
          <input
            type="text"
            placeholder="Mobile Number"
            id="mobile"
            className="border-2 border-kaavi py-1 pl-1 pr-5 rounded-md"
            defaultValue={exisitingLeader && exisitingLeader?.mobile}
            onChange={handleChange}
          />
        </div>
      </div>

      <div>
        <p className="font-medium lg:text-lg">Give Profile Picture</p>
        <input
          type="file"
          className="border-2 border-kaavi py-1 pl-1 rounded-md"
          onChange={(e) => setLeaderPhoto(e.target.files[0])}
        />
      </div>
      <button
        className="bg-kaavi text-white px-4 py-2 rounded-md"
        onClick={handleOpen}
      >
        Edit Gallery
      </button>

      <Dialog
        open={open}
        handler={handleOpen}
        className="overflow-scroll"
        style={{ maxHeight: "calc(100vh - 200px)" }}
      >
        <DialogBody className=" mx-auto w-full h-full">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <Typography variant="h4" color="blue-gray">
                Preview
              </Typography>
              <IoClose fontSize={30} onClick={handleClose} />
            </div>
            <div>
              {leaderGallery &&
                leaderGallery.map((photo, index) => (
                  <div key={index} className="relative">
                    <img
                      src={photo}
                      alt="photo index"
                      className="w-[85%] mx-auto rounded-xl my-2 border border-grey"
                    />
                    <IoClose
                      className="bg-white rounded-full absolute top-0 right-4"
                      fontSize={30}
                      onClick={() => handleDelete(photo)}
                    />
                  </div>
                ))}
              <input
                type="file"
                multiple
                onChange={(e) => setPhotos([...e.target.files])}
              />
              <button
                className="bg-kaavi text-white rounded-md px-4 py-2 block mt-8"
                onClick={handleAddGallery}
              >
                Submit photos
              </button>
            </div>
          </div>
        </DialogBody>
      </Dialog>
      <button
        onClick={handleLeader}
        className="bg-kaavi font-bold text-white px-4 py-2 rounded-md my-6"
      >
        Update
      </button>
    </div>
  );
}

export default RamaDass;

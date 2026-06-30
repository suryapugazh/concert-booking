import { Event } from "@/database";
import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const formData = await req.formData();

    let event;

    try {
      event = Object.fromEntries(formData.entries());
    } catch (e) {
      console.log(e);
      return NextResponse.json(
        { message: "Event Creation Failed" },
        { status: 400 },
      );
    }

    const imageFile = formData.get("image") as File;

    if (!imageFile) {
      return NextResponse.json(
        { message: "Image file is required" },
        { status: 400 },
      );
    }

    let tags = JSON.parse(formData.get('tags') as string);
    let agenda = JSON.parse(formData.get('agenda') as string);

    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { resource_type: "image", folder: "ConcertEvents" },
          (error, result) => {
            // console.log("Entered");
            if (error) return reject(error);
            resolve(result);
          },
        )
        .end(buffer);
    });

    event.image = (uploadResult as { secure_url: string }).secure_url;

    const createdEvent = await Event.create({
      ...event,
      tags: tags,
      agenda: agenda,
    });

    // console.log(createdEvent);
    return NextResponse.json(
      { message: "Event Created Successfully", event: createdEvent },
      { status: 201 },
    );
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      {
        message: "Event Creation Failed",
        error: e instanceof Error ? e.message : "Unknown",
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {

    await connectDB();

    const events = await Event.find().sort({ createdAt: -1});

    return NextResponse.json({ message: "Events fetched successfully", events}, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { message: "Event fetching failed", error: e },
      { status: 500 },
    );
  }
}

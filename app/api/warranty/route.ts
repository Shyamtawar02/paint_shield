import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db"; // Sahi waala import jo aapke lib/db.ts me hai

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, vehicleNo } = body;

    if (!phone || !vehicleNo) {
      return NextResponse.json({ error: "Phone number aur Vehicle number dono zaroori hain." }, { status: 400 });
    }

    // Aapke lib/db.ts ke connection ko call kiya
    const mongooseInstance = await dbConnect();
    // Specific database select karne ke liye connection useDb framework lagaya
    const db = mongooseInstance.connection.useDb("paintshield");

    const cleanPhone = phone.replace(/\D/g, "");
    const cleanVehicle = vehicleNo.trim().toUpperCase();
    
    // Sirf public data select kar rahe hain
    const customer = await db.collection("customers").findOne({
      vehicleNo: cleanVehicle
    });

    if (!customer) {
      return NextResponse.json({ error: "Is vehicle number ka koi record nahi mila." }, { status: 404 });
    }

    // Fallback logic taaki contact field agar undefined ho to crash na kare
    const rawContact = customer.contact || customer.contactNo || "";
    const dbPhoneClean = rawContact.replace(/\D/g, "");
    
    if (dbPhoneClean !== cleanPhone) {
      return NextResponse.json({ error: "Details match nahi ho rahi hain. Mobile number check karein." }, { status: 401 });
    }

    return NextResponse.json(customer);

  } catch (error) {
    console.error("Public Search API Error:", error);
    return NextResponse.json({ error: "Internal Server Error." }, { status: 500 });
  }
}
// All 64 districts of Bangladesh with coordinates
export interface District {
  name_en: string
  name_bn: string
  lat: number
  lon: number
  division: string
}

export const DISTRICTS: District[] = [
  { name_en: "Bagerhat", name_bn: "বাগেরহাট", lat: 22.6515, lon: 89.7852, division: "Khulna" },
  { name_en: "Bandarban", name_bn: "বান্দরবান", lat: 22.1953, lon: 92.2184, division: "Chattogram" },
  { name_en: "Barguna", name_bn: "বরগুনা", lat: 22.0953, lon: 90.1121, division: "Barishal" },
  { name_en: "Barishal", name_bn: "বরিশাল", lat: 22.7010, lon: 90.3535, division: "Barishal" },
  { name_en: "Bhola", name_bn: "ভোলা", lat: 22.6859, lon: 90.6483, division: "Barishal" },
  { name_en: "Bogra", name_bn: "বগুড়া", lat: 24.8466, lon: 89.3773, division: "Rajshahi" },
  { name_en: "Brahmanbaria", name_bn: "ব্রাহ্মণবাড়িয়া", lat: 23.9574, lon: 91.1125, division: "Chattogram" },
  { name_en: "Chandpur", name_bn: "চাঁদপুর", lat: 23.2333, lon: 90.6667, division: "Chattogram" },
  { name_en: "Chapainawabganj", name_bn: "চাঁপাইনবাবগঞ্জ", lat: 24.5965, lon: 88.2775, division: "Rajshahi" },
  { name_en: "Chattogram", name_bn: "চট্টগ্রাম", lat: 22.3569, lon: 91.7832, division: "Chattogram" },
  { name_en: "Chuadanga", name_bn: "চুয়াডাঙ্গা", lat: 23.6402, lon: 88.8411, division: "Khulna" },
  { name_en: "Comilla", name_bn: "কুমিল্লা", lat: 23.4683, lon: 91.1809, division: "Chattogram" },
  { name_en: "Cox's Bazar", name_bn: "কক্সবাজার", lat: 21.4272, lon: 92.0058, division: "Chattogram" },
  { name_en: "Dhaka", name_bn: "ঢাকা", lat: 23.8103, lon: 90.4125, division: "Dhaka" },
  { name_en: "Dinajpur", name_bn: "দিনাজপুর", lat: 25.6216, lon: 88.6351, division: "Rangpur" },
  { name_en: "Faridpur", name_bn: "ফরিদপুর", lat: 23.6071, lon: 89.8429, division: "Dhaka" },
  { name_en: "Feni", name_bn: "ফেনী", lat: 23.0159, lon: 91.3976, division: "Chattogram" },
  { name_en: "Gaibandha", name_bn: "গাইবান্ধা", lat: 25.3288, lon: 89.5415, division: "Rangpur" },
  { name_en: "Gazipur", name_bn: "গাজীপুর", lat: 23.9999, lon: 90.4203, division: "Dhaka" },
  { name_en: "Gopalganj", name_bn: "গোপালগঞ্জ", lat: 23.0050, lon: 89.8266, division: "Dhaka" },
  { name_en: "Habiganj", name_bn: "হবিগঞ্জ", lat: 24.3750, lon: 91.4131, division: "Sylhet" },
  { name_en: "Jamalpur", name_bn: "জামালপুর", lat: 24.9376, lon: 89.9373, division: "Mymensingh" },
  { name_en: "Jashore", name_bn: "যশোর", lat: 23.1667, lon: 89.2167, division: "Khulna" },
  { name_en: "Jhalokathi", name_bn: "ঝালকাঠি", lat: 22.6431, lon: 90.1992, division: "Barishal" },
  { name_en: "Jhenaidah", name_bn: "ঝিনাইদহ", lat: 23.5438, lon: 89.1801, division: "Khulna" },
  { name_en: "Joypurhat", name_bn: "জয়পুরহাট", lat: 25.1023, lon: 89.0270, division: "Rajshahi" },
  { name_en: "Khagrachhari", name_bn: "খাগড়াছড়ি", lat: 23.1193, lon: 91.9847, division: "Chattogram" },
  { name_en: "Khulna", name_bn: "খুলনা", lat: 22.8456, lon: 89.5403, division: "Khulna" },
  { name_en: "Kishoreganj", name_bn: "কিশোরগঞ্জ", lat: 24.4444, lon: 90.7833, division: "Dhaka" },
  { name_en: "Kurigram", name_bn: "কুড়িগ্রাম", lat: 25.8055, lon: 89.6362, division: "Rangpur" },
  { name_en: "Kushtia", name_bn: "কুষ্টিয়া", lat: 23.9012, lon: 89.1201, division: "Khulna" },
  { name_en: "Lakshmipur", name_bn: "লক্ষ্মীপুর", lat: 22.9424, lon: 90.8411, division: "Chattogram" },
  { name_en: "Lalmonirhat", name_bn: "লালমনিরহাট", lat: 25.9169, lon: 89.4450, division: "Rangpur" },
  { name_en: "Madaripur", name_bn: "মাদারীপুর", lat: 23.1647, lon: 90.1914, division: "Dhaka" },
  { name_en: "Magura", name_bn: "মাগুরা", lat: 23.4850, lon: 89.4196, division: "Khulna" },
  { name_en: "Manikganj", name_bn: "মানিকগঞ্জ", lat: 23.8625, lon: 90.0042, division: "Dhaka" },
  { name_en: "Meherpur", name_bn: "মেহেরপুর", lat: 23.7743, lon: 88.6417, division: "Khulna" },
  { name_en: "Moulvibazar", name_bn: "মৌলভীবাজার", lat: 24.4829, lon: 91.7773, division: "Sylhet" },
  { name_en: "Munshiganj", name_bn: "মুন্সীগঞ্জ", lat: 23.5439, lon: 90.5353, division: "Dhaka" },
  { name_en: "Mymensingh", name_bn: "ময়মনসিংহ", lat: 24.7471, lon: 90.4203, division: "Mymensingh" },
  { name_en: "Naogaon", name_bn: "নওগাঁ", lat: 24.7936, lon: 88.9318, division: "Rajshahi" },
  { name_en: "Narail", name_bn: "নড়াইল", lat: 23.1725, lon: 89.4951, division: "Khulna" },
  { name_en: "Narayanganj", name_bn: "নারায়ণগঞ্জ", lat: 23.6238, lon: 90.5000, division: "Dhaka" },
  { name_en: "Narsingdi", name_bn: "নরসিংদী", lat: 23.9231, lon: 90.7176, division: "Dhaka" },
  { name_en: "Natore", name_bn: "নাটোর", lat: 24.4110, lon: 88.9914, division: "Rajshahi" },
  { name_en: "Netrokona", name_bn: "নেত্রকোণা", lat: 24.8835, lon: 90.7283, division: "Mymensingh" },
  { name_en: "Nilphamari", name_bn: "নীলফামারী", lat: 25.9320, lon: 88.8560, division: "Rangpur" },
  { name_en: "Noakhali", name_bn: "নোয়াখালী", lat: 22.8696, lon: 91.0995, division: "Chattogram" },
  { name_en: "Pabna", name_bn: "পাবনা", lat: 24.0064, lon: 89.2372, division: "Rajshahi" },
  { name_en: "Panchagarh", name_bn: "পঞ্চগড়", lat: 26.3411, lon: 88.5548, division: "Rangpur" },
  { name_en: "Patuakhali", name_bn: "পটুয়াখালী", lat: 22.3596, lon: 90.3296, division: "Barishal" },
  { name_en: "Pirojpur", name_bn: "পিরোজপুর", lat: 22.5841, lon: 89.9750, division: "Barishal" },
  { name_en: "Rajbari", name_bn: "রাজবাড়ী", lat: 23.7570, lon: 89.6445, division: "Dhaka" },
  { name_en: "Rajshahi", name_bn: "রাজশাহী", lat: 24.3745, lon: 88.6042, division: "Rajshahi" },
  { name_en: "Rangamati", name_bn: "রাঙ্গামাটি", lat: 22.6344, lon: 92.1750, division: "Chattogram" },
  { name_en: "Rangpur", name_bn: "রংপুর", lat: 25.7466, lon: 89.2516, division: "Rangpur" },
  { name_en: "Satkhira", name_bn: "সাতক্ষীরা", lat: 22.7189, lon: 89.0725, division: "Khulna" },
  { name_en: "Shariatpur", name_bn: "শরীয়তপুর", lat: 23.2060, lon: 90.3500, division: "Dhaka" },
  { name_en: "Sherpur", name_bn: "শেরপুর", lat: 25.0188, lon: 90.0178, division: "Mymensingh" },
  { name_en: "Sirajganj", name_bn: "সিরাজগঞ্জ", lat: 24.4533, lon: 89.7003, division: "Rajshahi" },
  { name_en: "Sunamganj", name_bn: "সুনামগঞ্জ", lat: 25.0658, lon: 91.3950, division: "Sylhet" },
  { name_en: "Sylhet", name_bn: "সিলেট", lat: 24.8949, lon: 91.8687, division: "Sylhet" },
  { name_en: "Tangail", name_bn: "টাঙ্গাইল", lat: 24.2513, lon: 89.9167, division: "Dhaka" },
  { name_en: "Thakurgaon", name_bn: "ঠাকুরগাঁও", lat: 26.0335, lon: 88.4612, division: "Rangpur" },
]

export function getDistrict(name_en: string): District | undefined {
  return DISTRICTS.find((d) => d.name_en === name_en)
}

export function getDistrictBN(name_bn: string): District | undefined {
  return DISTRICTS.find((d) => d.name_bn === name_bn)
}

'use client';

import { useEffect, useState } from "react";
import { Star, Utensils, Calendar, Mail, Phone } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Review {
    id: number;
    name: string;
    rating: number;
    created_at: string;
    gender?: string;
    experience: string;
    email?: string;
    phone_number?: string;
}

// Validation function for email
const validateEmail = (email: string) => {
    // A simple regex for email validation
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
};

// Validation function for phone number (10 digits)
const validatePhoneNumber = (phone_number: string) => {
    // Regex for a 10-digit number
    const re = /^\d{10}$/;
    return re.test(phone_number);
};

export default function Reviews() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [name, setName] = useState("");
    const [rating, setRating] = useState(5);
    const [experience, setExperience] = useState("");
    const [gender, setGender] = useState("");
    const [email, setEmail] = useState("");
    const [phone_number, setPhone_number] = useState("");

    useEffect(() => {
        const fetchReviews = async () => {
            const response = await fetch('/api/reviews');
            if (response.ok) {
                const data = await response.json();
                setReviews(data);
            } else {
                console.error('Failed to fetch reviews');
            }
        };
        fetchReviews();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Added validation for all fields
        if (!name || !experience || !gender || !email || !phone_number) {
            alert("Please fill out all fields!");
            return;
        }

        // Validate email format
        if (!validateEmail(email)) {
            alert("Please enter a valid email address!");
            return;
        }

        // Validate phone number format (10 digits)
        if (!validatePhoneNumber(phone_number)) {
            alert("Please enter a valid 10-digit phone number!");
            return;
        }

        const newReview = { name, rating, experience, gender, email, phone_number };

        const response = await fetch('/api/reviews', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newReview),
        });

        if (response.ok) {
            const savedReview = await response.json();
            setReviews([savedReview, ...reviews]);
            setName("");
            setExperience("");
            setRating(5);
            setGender("");
            setEmail(""); // Reset email field
            setPhone_number(""); // Reset phone number field
        } else {
            console.error('Failed to submit review');
        }
    };

    const StarRating = ({ rating, setRating }: { rating: number, setRating?: (value: number) => void }) => {
        return (
            <div className="flex gap-1">
                {[...Array(5)].map((_, index) => (
                    <Star
                        key={index}
                        className={`w-6 h-6 cursor-pointer ${index < rating ? "fill-primary text-primary" : "text-gray-300"}`}
                        onClick={() => setRating && setRating(index + 1)}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="relative h-80 bg-cover bg-center bg-[url('/sec11.jpg')]">
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/60 mt-32"></div>
                <div className="flex justify-center">
                    <div className="bg-primary/20 p-4 rounded-full backdrop-blur-sm border border-primary/30 mt-36">
                        <Utensils className="w-8 h-8 text-white" />
                    </div>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 text-center text-white">
                    <h1 className="text-5xl font-bold">Bluemoon Reviews</h1>
                    <p className="text-xl font-light mt-3">Share Your Culinary Journey</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <Card className="p-10 mb-12 bg-card/50 backdrop-blur-sm border-2 border-primary/20 rounded-2xl">
                    <div className="text-center mb-8">
                        <Utensils className="w-10 h-10 text-primary mx-auto mb-4" />
                        <h2 className="text-3xl font-bold text-primary">Share Your Experience</h2>
                        <p className="text-muted-foreground mt-2">Let others know about your dining adventure</p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium mb-2">Your Name</label>
                                <Input
                                    type="text"
                                    placeholder="Enter your name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium">Gender</label>
                                <select
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                    className="w-full border rounded-md p-2"
                                    required
                                >
                                    <option value="" disabled>Select your gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>
                            {/* Added Email Input */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium mb-2">Email</label>
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            {/* Added Phone Number Input */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium mb-2">Phone Number</label>
                                <Input
                                    type="tel"
                                    placeholder="Enter your phone number"
                                    value={phone_number}
                                    onChange={(e) => setPhone_number(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium mb-2">Your Rating</label>
                            <StarRating rating={rating} setRating={setRating} />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium mb-2">Your Experience</label>
                            <Textarea
                                placeholder="Tell us about your dining experience..."
                                value={experience}
                                onChange={(e) => setExperience(e.target.value)}
                                required
                            />
                        </div>

                        <Button type="submit" className="w-full text-lg text-white py-6 bg-blue-800 hover:bg-primary/90 transition-all hover:scale-[1.02]">
                            Share Your Review
                        </Button>
                    </form>
                </Card>

                <div className="space-y-6">
                    {reviews.length === 0 ? (
                        <p className="text-center text-gray-500">No reviews yet. Be the first to share your experience!</p>
                    ) : (
                        reviews.map((review) => (
                            <Card key={review.id} className="p-6 border rounded-lg shadow-sm">
                                <h3 className="text-lg font-semibold">{review.name}</h3>
                                <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                    {review.email && (
                                        <div className="flex items-center gap-1">
                                            <Mail className="w-4 h-4" />
                                            <span>{review.email}</span>
                                        </div>
                                    )}
                                    {review.phone_number && (
                                        <div className="flex items-center gap-1">
                                            <Phone className="w-4 h-4" />
                                            <span>{review.phone_number}</span>
                                        </div>
                                    )}
                                </div>
                                <p className="text-sm text-gray-500 mt-2">
                                    <Calendar className="w-4 h-4 inline" /> {new Date(review.created_at).toLocaleDateString()}
                                </p>
                                <StarRating rating={review.rating} />
                                <p className="mt-4 italic text-gray-700">{review.experience}</p>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/db';
import { useAuth } from '@/hooks/AuthContext';
import { Plus, Star, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TestimonialFormData {
    comment: string;
    rating: number;
}

interface AddTestimonialProps {
    onTestimonialAdded?: () => void;
}

const AddTestimonial = ({ onTestimonialAdded }: AddTestimonialProps) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState<TestimonialFormData>({
        comment: '',
        rating: 5
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [open, setOpen] = useState(false);

    const MAX_COMMENT_LENGTH = 100;

    const handleInputChange = (field: keyof TestimonialFormData, value: string | number) => {
        if (field === 'comment' && typeof value === 'string') {
            if (value.length <= MAX_COMMENT_LENGTH) {
                setFormData(prev => ({
                    ...prev,
                    [field]: value
                }));
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [field]: value
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            navigate('/login', { state: { from: '/' } });
            return;
        }

        setIsSubmitting(true);

        try {
            // Insert testimonial with user profile data
            const { error: testimonialError } = await supabase
                .from('testimonial')
                .insert([
                    {
                        comment: formData.comment.trim(),
                        rating: formData.rating,
                        user_id: user.id,
                        user_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Anonymous',
                        user_avatar: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
                        created_at: new Date().toISOString()
                    }
                ]);

            if (testimonialError) {
                throw testimonialError;
            }

            // Reset form after delay
            setTimeout(() => {
                setFormData({
                    comment: '',
                    rating: 5
                });
                setOpen(false);

                if (onTestimonialAdded) {
                    onTestimonialAdded();
                }
            }, 2000);

        } catch (error) {
            console.error('Error adding testimonial:', error);
            alert('Gagal menambahkan testimonial. Silakan coba lagi.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLoginRedirect = () => {
        navigate('/login', { state: { from: '/' } });
    };

    const renderStars = (rating: number, isInteractive = false) => {
        return Array.from({ length: 5 }, (_, i) => {
            const starValue = i + 1;
            const isFullStar = rating >= starValue;
            const isHalfStar = rating >= starValue - 0.5 && rating < starValue;

            return (
                <div key={i} className="relative">
                    <Star
                        className={`w-6 h-6 cursor-pointer transition-colors ${isFullStar
                            ? 'fill-yellow-400 text-yellow-400'
                            : isHalfStar
                                ? 'text-yellow-400'
                                : 'text-gray-300 hover:text-yellow-200'
                            }`}
                        onClick={() => isInteractive && handleInputChange('rating', starValue)}
                    />
                    {isHalfStar && (
                        <Star
                            className="absolute top-0 left-0 w-6 h-6 fill-yellow-400 text-yellow-400"
                            style={{ clipPath: 'inset(0 50% 0 0)' }}
                        />
                    )}
                    {isInteractive && (
                        <div
                            className="absolute top-0 left-0 w-3 h-6 cursor-pointer"
                            onClick={() => handleInputChange('rating', starValue - 0.5)}
                        />
                    )}
                </div>
            );
        });
    };

    const ratingOptions = [
        { value: 5, label: 'Excellent' },
        { value: 4.5, label: 'Very Good+' },
        { value: 4, label: 'Very Good' },
        { value: 3.5, label: 'Good+' },
        { value: 3, label: 'Good' },
        { value: 2.5, label: 'Fair+' },
        { value: 2, label: 'Fair' },
        { value: 1.5, label: 'Poor+' },
        { value: 1, label: 'Poor' },
        { value: 0.5, label: 'Very Poor' }
    ];

    // If user is not logged in, show login prompt
    if (!user) {
        return (
            <div className="text-center space-y-4">
                <Button onClick={handleLoginRedirect} className="gap-2">
                    <LogIn className="w-4 h-4" />
                    Login untuk Memberikan Testimonial
                </Button>
                <p className="text-sm text-muted-foreground">
                    Anda perlu login terlebih dahulu untuk memberikan testimonial
                </p>
            </div>
        );
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Testimonial
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Tambah Testimonial Baru</DialogTitle>
                    <p className="text-sm text-muted-foreground">
                        Submit sebagai: {user.user_metadata?.full_name || user.email}
                    </p>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <Label>Rating *</Label>

                        <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                                {renderStars(formData.rating, true)}
                            </div>
                            <span className="text-sm text-muted-foreground ml-2">
                                {formData.rating} / 5
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            {ratingOptions.map((option) => (
                                <Button
                                    key={option.value}
                                    type="button"
                                    variant={formData.rating === option.value ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => handleInputChange('rating', option.value)}
                                    className="justify-start"
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="flex">
                                            {Array.from({ length: 5 }, (_, i) => {
                                                const starValue = i + 1;
                                                const isFullStar = option.value >= starValue;
                                                const isHalfStar = option.value >= starValue - 0.5 && option.value < starValue;

                                                return (
                                                    <div key={i} className="relative">
                                                        <Star
                                                            className={`w-3 h-3 ${isFullStar
                                                                ? 'fill-yellow-400 text-yellow-400'
                                                                : isHalfStar
                                                                    ? 'text-yellow-400'
                                                                    : 'text-gray-300'
                                                                }`}
                                                        />
                                                        {isHalfStar && (
                                                            <Star
                                                                className="absolute top-0 left-0 w-3 h-3 fill-yellow-400 text-yellow-400"
                                                                style={{ clipPath: 'inset(0 50% 0 0)' }}
                                                            />
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <span className="text-xs">{option.value} - {option.label}</span>
                                    </div>
                                </Button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="comment">Testimonial *</Label>
                        <Textarea
                            id="comment"
                            value={formData.comment}
                            onChange={(e) => handleInputChange('comment', e.target.value)}
                            placeholder="Bagikan pengalaman Anda dengan layanan catering kami..."
                            rows={4}
                            required
                            className="resize-none"
                            maxLength={MAX_COMMENT_LENGTH}
                        />
                        <div className="flex justify-between text-sm text-muted-foreground">
                            <span>
                                {formData.comment.length}/{MAX_COMMENT_LENGTH} karakter
                            </span>
                            <span className={formData.comment.length > MAX_COMMENT_LENGTH * 0.9 ? 'text-orange-500' : ''}>
                                {MAX_COMMENT_LENGTH - formData.comment.length} tersisa
                            </span>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={isSubmitting}
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting || !formData.comment.trim()}
                            className="min-w-[120px]"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Menyimpan...
                                </>
                            ) : (
                                'Simpan'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddTestimonial;
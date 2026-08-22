import { MessageSquare, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const FeedbackCTA = () => {
  return (
    <div className="py-16 text-center">
      <h3 className="text-2xl font-semibold text-slate-900 mb-3">
        Have something to say?
      </h3>
      <p className="text-slate-500 mb-8">
        We read every piece of feedback. It directly shapes what we build next.
      </p>
      <Link
        to="/feedback"
        className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-800 transition-colors"
      >
        <MessageSquare className="w-4 h-4" />
        Send feedback
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
};

export default FeedbackCTA;
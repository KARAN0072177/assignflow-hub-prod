import { MessageSquare, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const FeedbackCTA = () => {
  return (
    <div className="py-12 border-t border-slate-200/80 bg-white">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Have feedback on grading or classroom management?
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Our engineering team reviews community requests weekly.
          </p>
        </div>
        <Link
          to="/feedback"
          className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-300 text-slate-800 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-colors shrink-0"
        >
          <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
          <span>Send feedback</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default FeedbackCTA;
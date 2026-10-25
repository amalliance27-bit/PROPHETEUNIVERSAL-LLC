import React, { useState } from 'react';
import { FolderKanban, Sparkles, PlusCircle, ArrowRight, HeartPulse, GraduationCap, ShieldCheck, Laptop, CheckCircle2, Send, Users, Calendar, Award, Filter, Lightbulb, Compass, ThumbsUp } from 'lucide-react';

interface Project2027RoomProps {
  onReturnToContactUs?: () => void;
  onReturnToLobby?: () => void;
}

interface UserProject {
  id: string;
  title: string;
  category: string;
  creator: string;
  contact: string;
  description: string;
  timeline: string;
  status: 'Community Idea' | 'Under Review' | '2027 Roadmap' | 'Approved';
  votes: number;
  dateAdded: string;
}

const INITIAL_PROJECTS: UserProject[] = [
  {
    id: 'proj-1',
    title: 'Active Family Wellness & Fitness Movement',
    category: 'Health & Wellness',
    creator: 'Prophete Universal Leadership',
    contact: 'PropheteUniversal@gmail.com',
    description: 'A community-wide initiative focused on outdoor family workouts, nutritional guidance, active youth sports leagues, and senior mobility programs.',
    timeline: 'Q1 2027',
    status: '2027 Roadmap',
    votes: 42,
    dateAdded: '2026-08-01'
  },
  {
    id: 'proj-2',
    title: 'Universal Financial Literacy & Tax Workshop Series',
    category: 'Financial Literacy',
    creator: 'Rolin Prophete, Executive Director',
    contact: 'PropheteUniversal@gmail.com',
    description: 'Free weekly seminars in South Florida teaching families tax optimization, credit building, small business filing, and wealth preservation.',
    timeline: 'Q2 2027',
    status: 'Approved',
    votes: 38,
    dateAdded: '2026-07-15'
  },
  {
    id: 'proj-3',
    title: 'Youth Digital Tech & Entrepreneurship Lab',
    category: 'Youth & Tech',
    creator: 'Community Youth Board',
    contact: 'Askmorpheus247@gmail.com',
    description: 'Providing local students with web development tools, AI coding mentors, digital marketing tools, and entrepreneurship grants.',
    timeline: 'Q3 2027',
    status: 'Under Review',
    votes: 29,
    dateAdded: '2026-08-05'
  }
];

export const Projects2027Room: React.FC<Project2027RoomProps> = ({ onReturnToContactUs, onReturnToLobby }) => {
  const [activeTab, setActiveTab] = useState<'roadmap' | 'create' | 'board'>('roadmap');
  const [projects, setProjects] = useState<UserProject[]>(INITIAL_PROJECTS);
  
  // New Project Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Health & Wellness');
  const [creator, setCreator] = useState('');
  const [contact, setContact] = useState('');
  const [description, setDescription] = useState('');
  const [timeline, setTimeline] = useState('Q1 2027');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Upvote project
  const handleVote = (id: string) => {
    setProjects(prev =>
      prev.map(p => (p.id === id ? { ...p, votes: p.votes + 1 } : p))
    );
  };

  // Submit new project
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !creator || !description) return;

    const newProject: UserProject = {
      id: `proj-${Date.now()}`,
      title,
      category,
      creator,
      contact: contact || 'N/A',
      description,
      timeline,
      status: 'Community Idea',
      votes: 1,
      dateAdded: new Date().toISOString().split('T')[0]
    };

    setProjects([newProject, ...projects]);
    setSubmittedSuccess(true);
    
    // Reset form after delay
    setTimeout(() => {
      setTitle('');
      setCreator('');
      setContact('');
      setDescription('');
      setSubmittedSuccess(false);
      setActiveTab('board');
    }, 1800);
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-10 text-white font-sans max-w-7xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-emerald-950 border-2 border-emerald-400/60 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-72 h-72 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-400 text-slate-950 rounded-full text-xs font-black uppercase tracking-widest shadow-md whitespace-nowrap">
              <FolderKanban className="w-4 h-4 text-slate-950 shrink-0" />
              <span>PROJECT 2027</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-yellow-300 uppercase tracking-tight">
              PROJECT 2027 ROOM
            </h1>
            
            <p className="text-slate-200 text-sm sm:text-base md:text-lg leading-relaxed font-medium">
              Welcome to Prophete Universal’s Project 2027 Innovation Room. Explore our upcoming community initiatives, active family living programs, and create your own project proposal to shape our 2027 roadmap!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0 w-full md:w-auto">
            <button
              onClick={() => setActiveTab('create')}
              className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-amber-300 hover:from-yellow-300 hover:to-amber-200 text-slate-950 font-black text-sm uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer border border-yellow-100"
            >
              <PlusCircle className="w-5 h-5 text-slate-950" />
              <span>Create Project Proposal</span>
            </button>

            {(onReturnToContactUs || onReturnToLobby) && (
              <button
                onClick={onReturnToContactUs || onReturnToLobby}
                className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-500/40 font-bold text-xs uppercase tracking-wider rounded-xl transition-all text-center cursor-pointer"
              >
                Return to Contact us
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex flex-wrap gap-2 pt-6 mt-6 border-t border-teal-500/30">
          <button
            onClick={() => setActiveTab('roadmap')}
            className={`px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'roadmap'
                ? 'bg-emerald-400 text-slate-950 shadow-md scale-105'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>2027 Strategic Roadmap</span>
          </button>

          <button
            onClick={() => setActiveTab('create')}
            className={`px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'create'
                ? 'bg-yellow-400 text-slate-950 shadow-md scale-105'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Project</span>
          </button>

          <button
            onClick={() => setActiveTab('board')}
            className={`px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'board'
                ? 'bg-teal-400 text-slate-950 shadow-md scale-105'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Community Project Board ({projects.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: ROADMAP */}
      {activeTab === 'roadmap' && (
        <div className="space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-300 uppercase tracking-wide">
              Prophete Universal 2027 Core Pillars
            </h2>
            <p className="text-slate-300 text-sm sm:text-base">
              Our vision for 2027 integrates active family living, health and wellness education, financial empowerment, and digital community expansion.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-b from-slate-900 to-emerald-950 border border-emerald-500/40 rounded-2xl p-6 space-y-4 shadow-xl flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-400/20 text-emerald-300 border border-emerald-400/40 flex items-center justify-center">
                  <HeartPulse className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Active Living & Wellness</h3>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  Community fitness initiatives, health coaching, youth sports sponsorships, and family nutrition awareness.
                </p>
              </div>
              <div className="pt-2 text-xs font-extrabold text-emerald-300 uppercase tracking-wider">
                Target Launch: Q1 2027
              </div>
            </div>

            <div className="bg-gradient-to-b from-slate-900 to-teal-950 border border-teal-500/40 rounded-2xl p-6 space-y-4 shadow-xl flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-teal-400/20 text-teal-300 border border-teal-400/40 flex items-center justify-center">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Financial Literacy & Tax</h3>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  Empowering households with free tax workshops, credit education, small business guidance, and wealth preservation tools.
                </p>
              </div>
              <div className="pt-2 text-xs font-extrabold text-teal-300 uppercase tracking-wider">
                Target Launch: Q2 2027
              </div>
            </div>

            <div className="bg-gradient-to-b from-slate-900 to-amber-950 border border-amber-500/40 rounded-2xl p-6 space-y-4 shadow-xl flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/40 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Family Protection Shield</h3>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  Expanding access to Living Benefits life insurance, home safeguards, and generational estate protections.
                </p>
              </div>
              <div className="pt-2 text-xs font-extrabold text-amber-300 uppercase tracking-wider">
                Target Launch: Q2 2027
              </div>
            </div>

            <div className="bg-gradient-to-b from-slate-900 to-cyan-950 border border-cyan-500/40 rounded-2xl p-6 space-y-4 shadow-xl flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-cyan-400/20 text-cyan-300 border border-cyan-400/40 flex items-center justify-center">
                  <Laptop className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Youth & Tech Lab</h3>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  Interactive technology lounges, web design mentorship, and entrepreneurship grants for future leaders.
                </p>
              </div>
              <div className="pt-2 text-xs font-extrabold text-cyan-300 uppercase tracking-wider">
                Target Launch: Q3 2027
              </div>
            </div>
          </div>

          {/* Timeline Milestones */}
          <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-6 sm:p-8 space-y-6">
            <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <span>Project 2027 Development Phase Timeline</span>
            </h3>

            <div className="grid md:grid-cols-3 gap-6 relative">
              <div className="bg-slate-800/90 p-5 rounded-xl border border-emerald-500/40 space-y-2">
                <span className="text-xs font-black text-emerald-300 uppercase tracking-wider">Phase 1 - 2025</span>
                <h4 className="font-bold text-base text-white">Community Research & Feedback</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Gathering wishlist requests, identifying community needs, and forming strategic partner alliances.
                </p>
              </div>

              <div className="bg-slate-800/90 p-5 rounded-xl border border-yellow-500/40 space-y-2">
                <span className="text-xs font-black text-yellow-300 uppercase tracking-wider">Phase 2 - 2026</span>
                <h4 className="font-bold text-base text-white">Pilot Testing & Digital Room Launch</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Launching initial video workshops, active wellness showcases, and user-submitted project proposals.
                </p>
              </div>

              <div className="bg-slate-800/90 p-5 rounded-xl border border-cyan-500/40 space-y-2">
                <span className="text-xs font-black text-cyan-300 uppercase tracking-wider">Phase 3 - 2027</span>
                <h4 className="font-bold text-base text-white">Project 2027 Official Grand Launch</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Full deployment of active living centers, financial academies, and community empowerment grants.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CREATE PROJECT */}
      {activeTab === 'create' && (
        <div className="bg-slate-900/90 border-2 border-yellow-400/50 rounded-3xl p-6 sm:p-8 shadow-2xl max-w-3xl mx-auto space-y-6">
          <div className="space-y-2 border-b border-slate-700/80 pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-400/20 text-yellow-300 border border-yellow-400/40 rounded-full text-xs font-bold uppercase">
              <Lightbulb className="w-4 h-4" />
              <span>Project Creator Form</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              Create a Project Proposal for 2027
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm">
              Have an idea for a community wellness initiative, active living event, or educational workshop? Submit your project idea directly to our leadership team.
            </p>
          </div>

          {submittedSuccess ? (
            <div className="p-6 bg-emerald-950/80 border-2 border-emerald-400 rounded-2xl text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
              <h3 className="text-2xl font-black text-emerald-200">Project Proposal Submitted!</h3>
              <p className="text-sm text-slate-200">
                Thank you! Your project idea has been added to our Community Board and queued for 2027 review.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Youth Soccer & Active Living Camp"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-yellow-400 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-yellow-400 transition-colors"
                  >
                    <option value="Health & Wellness">Health & Wellness</option>
                    <option value="Financial Literacy">Financial Literacy</option>
                    <option value="Youth & Tech">Youth & Tech</option>
                    <option value="Family Insurance">Family Insurance</option>
                    <option value="Community Drive">Community Drive</option>
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Organizer / Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Your Full Name"
                    value={creator}
                    onChange={(e) => setCreator(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-yellow-400 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Contact Email or Phone
                  </label>
                  <input
                    type="text"
                    placeholder="email@example.com or phone"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-yellow-400 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Target Timeline
                </label>
                <select
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-yellow-400 transition-colors"
                >
                  <option value="Q1 2027">Q1 2027 (Jan - Mar)</option>
                  <option value="Q2 2027">Q2 2027 (Apr - Jun)</option>
                  <option value="Q3 2027">Q3 2027 (Jul - Sep)</option>
                  <option value="Q4 2027">Q4 2027 (Oct - Dec)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Project Description & Vision *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe the goals, community benefits, required resources, and target audience for this project..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white text-sm focus:outline-none focus:border-yellow-400 transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:brightness-110 text-slate-950 font-black rounded-xl uppercase tracking-wider text-sm sm:text-base shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer border border-yellow-200"
              >
                <Send className="w-5 h-5 text-slate-950" />
                <span>Submit Project Proposal</span>
              </button>
            </form>
          )}
        </div>
      )}

      {/* TAB 3: COMMUNITY BOARD */}
      {activeTab === 'board' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                Community Project Board
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm">
                Explore, vote for, and support community projects proposed for the 2027 roadmap.
              </p>
            </div>

            <button
              onClick={() => setActiveTab('create')}
              className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Propose Project</span>
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="bg-slate-900/90 border border-slate-700/80 hover:border-teal-400/60 rounded-2xl p-6 space-y-4 shadow-xl transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-3 py-1 bg-teal-900/60 text-teal-300 border border-teal-500/40 text-xs font-bold rounded-full uppercase tracking-wider">
                      {proj.category}
                    </span>
                    <span className={`px-2.5 py-0.5 text-xs font-black rounded uppercase tracking-wider ${
                      proj.status === 'Approved'
                        ? 'bg-emerald-400 text-slate-950'
                        : proj.status === '2027 Roadmap'
                        ? 'bg-yellow-400 text-slate-950'
                        : 'bg-slate-800 text-slate-300 border border-slate-600'
                    }`}>
                      {proj.status}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white leading-snug">{proj.title}</h3>

                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                    {proj.description}
                  </p>

                  <div className="p-3 bg-slate-800/80 rounded-xl space-y-1 text-xs text-slate-300">
                    <div><strong className="text-slate-200">Proposed By:</strong> {proj.creator}</div>
                    <div><strong className="text-slate-200">Timeline:</strong> {proj.timeline}</div>
                    {proj.contact !== 'N/A' && <div><strong className="text-slate-200">Contact:</strong> {proj.contact}</div>}
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                  <button
                    onClick={() => handleVote(proj.id)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-yellow-300 font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                  >
                    <ThumbsUp className="w-4 h-4 text-yellow-400" />
                    <span>Support Project ({proj.votes})</span>
                  </button>

                  <span className="text-[11px] text-slate-400 font-medium">
                    Added {proj.dateAdded}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Toaster } from "sonner";
import { Brain, LayoutDashboard, User, LogOut, Plus, BarChart3, HelpCircle } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./components/ui/tabs";
import { Button } from "./components/ui/button";
import { useAuth } from "./context/AuthContext";

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  // Get active tab from URL
  const getActiveTab = () => {
    if (location.pathname.startsWith('/app/dashboard')) return 'dashboard';
    if (location.pathname.startsWith('/app/complaints')) return 'submit';
    if (location.pathname.startsWith('/app/analytics')) return 'analytics';
    return 'dashboard';
  };

  const [activeTab, setActiveTab] = useState(getActiveTab());

  // Handle tab change with navigation
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    switch (value) {
      case 'dashboard':
        navigate('/app/dashboard');
        break;
      case 'submit':
        navigate('/app/complaints');
        break;
      case 'analytics':
        navigate('/app/analytics');
        break;
      default:
        navigate('/app/dashboard');
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Toaster position="top-right" richColors />
        <Outlet />
      </div>
    );
  }

  // Navbar component
  const Navbar = () => {
    return (

      // the top navbar...
      
      <nav className="bg-white shadow-sm ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="flex items-center justify-center w-10 h-10 bg-primary text-primary-foreground rounded-lg">
                  <Brain className="h-6 w-6" />
                </div>
                <h1 className="ml-3 text-xl font-semibold">Complaint AI</h1>
              </div>
            </div>
           
            <div className="hidden md:ml-6 md:flex md:items-center">
            
             {/* Add here the button for domain switcher etc... */}
             
            </div>
            <div className="-mr-2 flex items-center md:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        {/* Mobile menu */}
        <div className="md:hidden" id="mobile-menu">
          <div className="pt-2 pb-3 space-y-1">
            <button
              onClick={() => handleTabChange('dashboard')}
              className={`w-full text-left block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${activeTab === 'dashboard'
                  ? 'bg-primary-50 border-primary-500 text-primary-700'
                  : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                }`}
            >
              {/* <div className="flex items-center">
                <LayoutDashboard className="h-5 w-5 mr-3" />
                Dashboard
              </div>
            </button>
            <button
              onClick={() => handleTabChange('submit')}
              className={`w-full text-left block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${activeTab === 'submit'
                  ? 'bg-primary-50 border-primary-500 text-primary-700'
                  : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                }`}
            >
              <div className="flex items-center">
                <Plus className="h-5 w-5 mr-3" />
                Submit Complaint
              </div>
            </button>
            <button
              onClick={() => handleTabChange('analytics')}
              className={`w-full text-left block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${activeTab === 'analytics'
                  ? 'bg-primary-50 border-primary-500 text-primary-700'
                  : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                }`}
            >
              <div className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-3" />
                Analytics
              </div> */}
            </button>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <User className="h-10 w-10 rounded-full text-gray-400" />
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">
                  {currentUser.email?.split('@')[0] || 'User'}
                </div>
                <div className="text-sm font-medium text-gray-500">
                  {currentUser.email}
                </div>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <button
                onClick={() => navigate('/app/profile')}
                className="block w-full px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 text-left"
              >
                Your Profile
              </button>
              <button
                onClick={logout}
                className="block w-full px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 text-left"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Toaster position="top-right" richColors />
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Hidden on mobile, shown on medium screens and up */}
        <div className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-16 border-r border-gray-200 bg-white">
            <div className="flex items-center justify-center h-16 border-b border-gray-200">
              <div className="flex items-center justify-center w-10 h-10 bg-primary text-primary-foreground rounded-lg">
                <Brain className="h-6 w-6" />
              </div>
            </div>
           

            <div className="p-2 border-t border-gray-200">
              <div className="flex flex-col items-center space-y-2">
                <button
                  onClick={() => navigate('/app/profile')}
                  className="p-2 text-gray-600 hover:text-gray-900"
                  title="Profile"
                >
                  <User className="h-5 w-5" />
                </button>
                <button
                  onClick={logout}
                  className="p-2 text-gray-600 hover:text-gray-900"
                  title="Sign out"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Mobile navigation tabs */}
        {/* <div className="md:hidden border-t border-gray-200">
          <div className="grid grid-cols-3">
            <button
              onClick={() => handleTabChange('dashboard')}
              className={`flex flex-col items-center justify-center py-2 text-xs ${activeTab === 'dashboard' ? 'text-primary' : 'text-gray-600'}`}
            >
              <LayoutDashboard className="h-5 w-5 mb-1" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => handleTabChange('submit')}
              className={`flex flex-col items-center justify-center py-2 text-xs ${activeTab === 'submit' ? 'text-primary' : 'text-gray-600'}`}
            >
              <Plus className="h-5 w-5 mb-1" />
              <span>Submit</span>
            </button>
            <button
              onClick={() => handleTabChange('analytics')}
              className={`flex flex-col items-center justify-center py-2 text-xs ${activeTab === 'analytics' ? 'text-primary' : 'text-gray-600'}`}
            >
              <BarChart3 className="h-5 w-5 mb-1" />
              <span>Analytics</span>
            </button>
          </div>
        </div> */}

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-100 p-4 md:p-6 border border-gray-300 rounded-[28px]">
          <div className="container mx-auto px-3 md:px-4 py-4 md:py-6 border border-gray-200 rounded-[14px] bg-white">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="bg-muted text-muted-foreground items-center justify-center rounded-[25px] py-[2px] px-[-1px] grid w-full max-w-xs sm:max-w-md md:max-w-xl lg:max-w-2xl grid-cols-3 mb-4 md:mb-6 h-11 mx-auto border">
                <TabsTrigger value="dashboard" className="flex items-center justify-center gap-1 py-2 text-xs md:text-sm rounded-[25px] min-w-0">
                  <LayoutDashboard className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
                  <span className="hidden md:inline truncate">Dashboard</span>
                </TabsTrigger>
                <TabsTrigger value="submit" className="flex items-center justify-center gap-1 py-2 text-xs md:text-sm rounded-[25px] min-w-0">
                  <Plus className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
                  <span className="hidden md:inline truncate">Submit</span>
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center justify-center gap-1 py-2 text-xs md:text-sm rounded-[25px] min-w-0">
                  <BarChart3 className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
                  <span className="hidden md:inline truncate">Analytics</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="dashboard" className="space-y-4 md:space-y-6">
                <div className="mb-4 md:mb-6">
                  <h2 className="text-xl md:text-2xl font-semibold mb-2">
                    Dashboard
                  </h2>
                  <p className="text-sm md:text-base text-muted-foreground">
                    Overview of all complaints and their AI-powered analysis status
                  </p>
                </div>
                <Outlet />
              </TabsContent>

              <TabsContent value="submit" className="space-y-4 md:space-y-6">
                <div className="mb-4 md:mb-6 text-center">
                  <h2 className="text-xl md:text-2xl font-semibold mb-2">Submit a Complaint</h2>
                  <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto px-2">
                    Our AI system will automatically analyze your complaint, categorize it,
                    determine the priority level, and route it to the appropriate department for quick resolution.
                  </p>
                </div>
                <Outlet />
              </TabsContent>

              <TabsContent value="analytics" className="space-y-4 md:space-y-6">
                <div className="mb-4 md:mb-6">
                  <h2 className="text-xl md:text-2xl font-semibold mb-2">Analytics & Insights</h2>
                  <p className="text-sm md:text-base text-muted-foreground px-2">
                    Comprehensive analytics powered by AI to identify patterns, trends, and improvement opportunities
                  </p>
                </div>
                <Outlet />
              </TabsContent>
            </Tabs>
          </div>

          {/* Help Section */}
          <div className="fixed bottom-4 right-4 z-50">
            <Button size="sm" variant="outline" className="rounded-full shadow-lg px-3 md:px-4 border">
              <HelpCircle className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Help</span>
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;

import { Bell } from "lucide-react";
import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="bg-slate-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          @PAI マメナカタ
        </Link>
        <nav className="flex items-center space-x-4">
          <Link to="/contacts" className="hover:text-slate-300">
            カルテ管理
          </Link>
          <Link to="/events" className="hover:text-slate-300">
            イベント管理
          </Link>
          <Link to="/notifications" className="hover:text-slate-300 flex items-center">
            <Bell className="mr-1" size={18} />
            通知
          </Link>
        </nav>
      </div>
    </header>
  );
}

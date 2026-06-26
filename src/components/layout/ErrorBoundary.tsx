import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error inside Athary applet platform:", error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div 
          className="min-h-screen bg-amber-50/50 flex items-center justify-center p-6 text-right dir-rtl font-sans"
          id="athary-error-boundary-screen"
        >
          <div className="bg-white border-2 border-amber-200 p-8 rounded-3xl max-w-lg w-full text-center space-y-6 shadow-xl relative overflow-hidden">
            {/* Retro frame and visual texture */}
            <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-red-500 to-orange-500" />
            <div className="absolute top-2 left-2 w-8 h-8 rounded-full border border-amber-200/50 opacity-45 flex items-center justify-center font-serif text-[10px] text-stone-300">
              آثاري
            </div>

            <div className="w-16 h-16 bg-red-50 text-red-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <AlertTriangle className="w-8 h-8 stroke-[1.5]" />
            </div>

            <div className="space-y-2">
              <h2 className="text-base sm:text-lg font-black text-orange-950 font-serif">
                عذراً، حدث خطأ غير متوقع في اللوحة المعرفية
              </h2>
              <p className="text-xs text-stone-500 leading-relaxed max-w-sm mx-auto">
                لقد واجه خادمنا أو ملف الواجهة عائقاً مؤقتاً أثناء سحب السجلات الجارية. لا تقلق، لم تفقد مجهودات حلك أو تقدمك الأكاديمي.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 text-right">
                <span className="text-[9px] text-stone-400 block font-mono">تفصيل الخطأ الفني للرقباء:</span>
                <code className="text-[10px] text-red-700 font-mono block leading-relaxed break-words mt-1">
                  {this.state.error.toString()}
                </code>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={this.handleRetry}
                className="flex-1 bg-orange-700 hover:bg-orange-800 text-amber-50 py-3 rounded-xl text-xs font-black border-0 cursor-pointer shadow-sm transition flex items-center justify-center gap-1.5"
                id="error-boundary-retry-btn"
              >
                <RotateCcw className="w-4 h-4" />
                <span>إعادة المحاولة فوراً</span>
              </button>
              
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.href = '/';
                }}
                className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-700 py-3 rounded-xl text-xs font-bold border-0 cursor-pointer transition flex items-center justify-center gap-1.5"
              >
                <Home className="w-4 h-4 text-stone-500" />
                <span>العودة للمقعد الرئيسي</span>
              </button>
            </div>

            <p className="text-[9px] text-stone-400 font-mono">
              رمز السهم: ATH-ERR-BO-RECOVER
            </p>

          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

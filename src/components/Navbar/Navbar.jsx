// import React from 'react';
// import {Bot} from 'lucide-react';

// export const Navbar = () => {
//   return (
//     <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg w-full">
//         <div className="px-4 py-3 flex justify-between w-full">
//             <div className="flex items-center gap-2">
//                 <Bot className="w-6 h-6" />
//                 <h1 className="text-xl font-bold">Bonobos v0.1</h1>
//             </div>
//             <div className="text-sm bg-blue-700 px-3 py-1 rounded-full bg-opacity-50">
//                 Beta
//             </div>
//         </div>
//     </div>
//   );
// };

import React from 'react';
import { Bot } from 'lucide-react';

export const Navbar = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg w-full">
      <div className="px-4 py-3 flex justify-between">
        <div className="flex items-center gap-2">
          <Bot className="w-6 h-6" />
          <h1 className="text-xl font-bold">Augmentix v0.1</h1>
        </div>
        <div className="text-sm bg-blue-700 px-3 py-1 rounded-full bg-opacity-50">
          Beta
        </div>
      </div>
    </div>
  );
};
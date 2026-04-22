function Cardstate(){
      const statsData = [
    { id: 1, title: "Total Notes", value: 24, trend: "+3 this week" },
    { id: 2, title: "Study Groups", value: 5, trend: "2 active now" },
    { id: 3, title: "Study Hours", value: 18.5, trend: "+2.5 hours" },
    { id: 4, title: "Quiz Score", value: "87%", trend: "+5% from last" },
  ];

  return(
        <div>
   <div className="mb-8 ml-2 place-items-start"> 
      <h1 className="text-3xl font-bold text-slate-900 leading-tight">
        Welcome back, Student
      </h1>
      <p className="text-slate-500 mt-1 text-lg">
        Here's what's happening with your studies today.
      </p>
    </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {statsData.map((item) => (
          <div
            key={item.id}
            className="bg-white p-7 rounded-4xl border border-slate-100   flex flex-col items-start "
          >
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight leading-none mb-2">
              {item.value}
            </h3>
            <p className="text-slate-400 text-lg font-medium mb-3">{item.title}</p>
            <span className="text-indigo-500 text-sm font-bold tracking-wide">
              {item.trend}
            </span>
          </div>
        ))}
      </div>

    </div>
  )



}
export default Cardstate
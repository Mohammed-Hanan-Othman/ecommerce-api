const paginate = () =>{
    return (req,res,next) =>{
        // Obtain data from the locals object
        const data = res.locals.data;

        if( !data || !Array.isArray(data)){
            return res.status(500).json({error:"Data is invalid or missing"});
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        
        // calculate start and end indices
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        // calculate total pages
        const totalItems = data.length;
        const totalPages = Math.ceil(totalItems / limit);

        // Handle edge cases
        if (page > totalPages || page < 1){
            return res.status(400).json({
                error:{
                    message: `Page ${page} is out of range`,
                    total_pages: totalPages,
                    suggestion: `Try a page between 1 and ${totalPages}`
                }
            });
        }

        // Paginated data
        const paginatedResult = data.slice(startIndex, endIndex);

        // Metadata 
        const metadata = {
            current_page: page,
            per_page: limit,
            total_items: totalItems,
            total_pages: totalPages,
            has_next_page: endIndex < totalItems,
            has_previous_page: startIndex > 0
        };

        // Add paginated data to response
        res.paginatedResult = {
            metadata,
            data: paginatedResult
        };
        
        next();
    }
}

module.exports = {paginate}
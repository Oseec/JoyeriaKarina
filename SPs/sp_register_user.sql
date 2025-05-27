CREATE PROCEDURE sp_register_user
  @Username    NVARCHAR(50),
  @PasswordHash NVARCHAR(200),
  @FullName    NVARCHAR(100) = NULL,
  @Role        NVARCHAR(20)  = 'employee'
AS
BEGIN
  SET NOCOUNT ON;
  BEGIN TRY
    INSERT INTO Users (Username, PasswordHash, fullName, role)
    VALUES (@Username, @PasswordHash, @FullName, @Role);

    SELECT CAST(SCOPE_IDENTITY() AS INT) AS NewUserId;
  END TRY
  BEGIN CATCH

    DECLARE @ErrMsg NVARCHAR(4000) = ERROR_MESSAGE();
    THROW 50000, @ErrMsg, 1;
  END CATCH
  SET NOCOUNT OFF;
END;
